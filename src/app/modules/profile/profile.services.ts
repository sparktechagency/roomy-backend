import { Types } from 'mongoose';
import { ENUM_USER_ROLE } from '../../../enums/enum';
import CustomError from '../../errors';
import { IBaseProfile } from './profile.interface';
import Profile from './profile.model';

const retrieveAllProfiles = async (
  query: Record<string, any>,
  role: string,
): Promise<{
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  data: any[];
}> => {
  const page = parseInt(query.page as string) || 1;
  const limit = parseInt(query.limit as string) || 10;
  const skip = (page - 1) * limit;
  const searchTerm = query.searchTerm || '';
  const searchRegex = { $regex: searchTerm, $options: 'i' };

  const matchStage: any = {
    $and: [
      { role },
      {
        $or: [{ firstName: searchRegex }, { lastName: searchRegex }, { address: searchRegex }, { 'user.email': searchRegex }],
      },
    ],
  };

  const pipeline: any[] = [
    {
      $lookup: {
        from: 'users',
        localField: 'user',
        foreignField: '_id',
        as: 'user',
      },
    },
    { $unwind: '$user' },
    { $match: matchStage },
  ];

  if (role === ENUM_USER_ROLE.HOST) {
    pipeline.push(
      {
        $lookup: {
          from: 'listings',
          let: { userId: '$user._id' },
          pipeline: [
            {
              $match: {
                $expr: { $eq: ['$host', '$$userId'] },
              },
            },
          ],
          as: 'listings',
        },
      },
      {
        $addFields: {
          totalListing: { $size: '$listings' },
        },
      },
    );
  }

  pipeline.push({
    $facet: {
      data: [
        {
          $project: {
            _id: '$user._id',
            fullName: {
              $concat: [{ $ifNull: ['$firstName', ''] }, ' ', { $ifNull: ['$lastName', ''] }],
            },
            profileImage: 1,
            address: 1,
            email: '$user.email',
            ...(role === 'host' ? { totalListing: 1 } : {}),
          },
        },
        { $skip: skip },
        { $limit: limit },
      ],
      meta: [{ $count: 'total' }],
    },
  });

  const [result] = await Profile.aggregate(pipeline);

  const total = result.meta[0]?.total || 0;
  const totalPages = Math.ceil(total / limit);

  return {
    meta: {
      page,
      limit,
      total,
      totalPages,
    },
    data: result.data,
  };
};

// retrieve single profile
const retrieveSingleProfile = async (userId: string, viewerId: string) => {
  const isOwner = userId === viewerId;

  const result = await Profile.aggregate([
    {
      $match: { user: new Types.ObjectId(userId) },
    },

    // Calculate profile completion fields
    {
      $addFields: {
        fieldsToCheck: [
          '$firstName',
          '$lastName',
          '$bio',
          '$antecode',
          '$address',
          '$profileImage',
          '$gender',
          '$photoGallery',
          '$socialLinks',
          '$dateOfBirth',
        ],
      },
    },
    {
      $addFields: {
        completedFields: {
          $size: {
            $filter: {
              input: '$fieldsToCheck',
              as: 'field',
              cond: {
                $and: [
                  { $ne: ['$$field', null] },
                  { $ne: ['$$field', ''] },
                  { $ne: ['$$field', []] },
                  {
                    $cond: {
                      if: { $eq: [{ $type: '$$field' }, 'object'] },
                      then: {
                        $gt: [{ $size: { $objectToArray: '$$field' } }, 0],
                      },
                      else: true,
                    },
                  },
                ],
              },
            },
          },
        },
        totalFields: { $size: '$fieldsToCheck' },
      },
    },
    {
      $addFields: {
        profileCompletion: {
          $round: [
            {
              $multiply: [{ $divide: ['$completedFields', '$totalFields'] }, 100],
            },
            0,
          ],
        },
        name: { $concat: ['$firstName', ' ', '$lastName'] },
      },
    },

    // Handle visibility logic BEFORE projection
    {
      $addFields: {
        showBio: '$bio', // always show
        showProfileImage: '$profileImage', // always show
        showAntecode: {
          $cond: [isOwner || '$isProfileVisible', '$antecode', '$$REMOVE'],
        },
        showAddress: {
          $cond: [isOwner || '$isProfileVisible', '$address', '$$REMOVE'],
        },
        showPhotoGallery: {
          $cond: [isOwner || '$isProfileVisible', '$photoGallery', '$$REMOVE'],
        },
        showSocialLinks: {
          $cond: [isOwner || '$isProfileVisible', '$socialLinks', '$$REMOVE'],
        },
        showGender: {
          $cond: [isOwner || '$isProfileVisible', '$gender', '$$REMOVE'],
        },
        showDateOfBirth: {
          $cond: [isOwner || '$isProfileVisible', '$dateOfBirth', '$$REMOVE'],
        },
        showFirstName: {
          $cond: [isOwner || '$isProfileVisible', '$firstName', '$$REMOVE'],
        },
        showLastName: {
          $cond: [isOwner || '$isProfileVisible', '$lastName', '$$REMOVE'],
        },
        showProfileCompletion: {
          $cond: [isOwner, '$profileCompletion', '$$REMOVE'],
        },
      },
    },

    // Final projection: show only "show*" fields
    {
      $project: {
        _id: 1,
        name: 1,
        profileCompletion: '$showProfileCompletion',
        bio: '$showBio',
        antecode: '$showAntecode',
        address: '$showAddress',
        profileImage: '$showProfileImage',
        photoGallery: '$showPhotoGallery',
        socialLinks: '$showSocialLinks',
        gender: '$showGender',
        dateOfBirth: '$showDateOfBirth',
        firstName: '$showFirstName',
        lastName: '$showLastName',
        isProfileVisible: 1,
      },
    },
  ]);

  if (!result.length) {
    throw new CustomError.NotFoundError('Profile not found for this user');
  }

  return result[0];
};

const updateProfileInfo = async (data: IBaseProfile, id: string) => {
  const profile: any = await Profile.findOne({ user: id });
  const result = await Profile.findByIdAndUpdate(profile._id, data, { new: true });
  console.log(result);
  if (!result) {
    throw new CustomError.BadRequestError('Failed to update profile');
  }
  return result;
};

const updateProfileVisibility = async (data: IBaseProfile, id: string) => {
  const profile: any = await Profile.findOne({ user: id });
  console.log(profile);
  const result = await Profile.findByIdAndUpdate(profile._id, data, { new: true });

  if (!result) {
    throw new CustomError.BadRequestError('Failed to update profile');
  }
  return result;
};

export default {
  retrieveAllProfiles,
  updateProfileInfo,
  updateProfileVisibility,
  retrieveSingleProfile,
};
