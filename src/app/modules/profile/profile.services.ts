import { ENUM_USER_ROLE } from '../../../enums/user-role';
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

export default {
  retrieveAllProfiles,
};
