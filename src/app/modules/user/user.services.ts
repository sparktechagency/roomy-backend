import { ClientSession } from 'mongoose';
import config from '../../../config';
import { ENUM_USER_ROLE } from '../../../enums/user-role';
import withTransaction from '../../../helpers/withTransaction';
import registrationEmailTemplate from '../../../mailTemplate/registrationTemplate';
import IdGenerator from '../../../utilities/idGenerator';
import sendMail from '../../../utilities/sendEmail';
import CustomError from '../../errors';
import GuestProfile from '../guestProfile/guest.model';
import guestServices from '../guestProfile/guest.services';
import HostProfile from '../hostProfile/host-model';
import hostServices from '../hostProfile/host-services';
import { IBaseProfile } from '../profile/profile.interface';
import IUser from './user.interface';
import User from './user.model';

export const createUser = async (data: IUser & IBaseProfile, role: string) => {
  const result = await withTransaction(async (session: ClientSession) => {
    const verificationCode = IdGenerator.generateNumberId();
    const expiredTime = 30;
    const expireDate = new Date();
    expireDate.setMinutes(expireDate.getMinutes() + expiredTime);

    // Step 1: Create user
    const userData = {
      email: data.email,
      phone: data.phone,
      password: data.password,
      verification: {
        code: verificationCode,
        expireDate,
      },
    };

    console.log('role', role);
    console.time('User.create');
    const [newUser]: any = await User.create([userData], { session });
    console.timeEnd('User.create');

    if (!newUser) {
      throw new CustomError.BadRequestError('Failed to create user');
    }

    const profilePayload: any = {
      user: newUser._id,
      firstName: data.firstName,
      lastName: data.lastName,
      gender: data.gender,
      dateOfBirth: data.dateOfBirth,
    };

    switch (role) {
      case ENUM_USER_ROLE.GUEST:
        const guestProfile = await guestServices.createGuestProfile(profilePayload, session);
        newUser.profile.id = guestProfile._id;
        newUser.profile.role = role;
        await newUser.save({ session });
        break;

      case ENUM_USER_ROLE.HOST:
        const hostProfile = await hostServices.createHostProfile(profilePayload, session);
        newUser.profile.id = hostProfile._id;
        newUser.profile.role = role;
        await newUser.save({ session });
        break;

      default:
        throw new CustomError.BadRequestError('Invalid role provided.');
    }

    const { password, verification, ...userInfo } = newUser.toObject();

    const fullName = `${data.firstName} ${data.lastName}`;
    const mailOptions = {
      from: config.gmail_app_user,
      to: newUser.email,
      subject: 'Email Verification',
      html: registrationEmailTemplate(fullName, verificationCode, expiredTime, 'Roomy'),
    };
    sendMail(mailOptions);

    return { ...userInfo };
  });

  return result;
};

const retrieveAllGuests = async (
  query: Record<string, any>,
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

  const [result] = await GuestProfile.aggregate([
    {
      $lookup: {
        from: 'users',
        localField: 'user',
        foreignField: '_id',
        as: 'user',
      },
    },
    { $unwind: '$user' },
    {
      $match: {
        $and: [
          {
            $or: [{ firstName: searchRegex }, { lastName: searchRegex }, { address: searchRegex }, { 'user.email': searchRegex }],
          },
        ],
      },
    },
    {
      $facet: {
        data: [
          {
            $project: {
              _id: 1,
              fullName: {
                $concat: [{ $ifNull: ['$firstName', ''] }, ' ', { $ifNull: ['$lastName', ''] }],
              },
              profileImage: 1,
              address: 1,
              email: '$user.email',
            },
          },
          { $skip: skip },
          { $limit: limit },
        ],
        meta: [{ $count: 'total' }],
      },
    },
  ]);

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

const retrieveAllHosts = async (
  query: Record<string, any>,
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

  const [result] = await HostProfile.aggregate([
    // 🔁 1. Lookup listings FIRST (before we overwrite `user`)
    {
      $lookup: {
        from: 'listings',
        localField: 'user',
        foreignField: 'host',
        as: 'listings',
      },
    },
    {
      $addFields: {
        listingCount: { $size: '$listings' },
      },
    },

    {
      $lookup: {
        from: 'users',
        localField: 'user',
        foreignField: '_id',
        as: 'user',
      },
    },
    { $unwind: '$user' },

    {
      $match: {
        $or: [{ firstName: searchRegex }, { lastName: searchRegex }, { address: searchRegex }, { 'user.email': searchRegex }],
      },
    },

    {
      $facet: {
        data: [
          {
            $project: {
              _id: '$user._id',
              profileImage: 1,
              address: 1,
              email: '$user.email',
              fullName: {
                $concat: [{ $ifNull: ['$firstName', ''] }, ' ', { $ifNull: ['$lastName', ''] }],
              },
              listingCount: 1,
            },
          },
          { $skip: skip },
          { $limit: limit },
        ],
        meta: [{ $count: 'total' }],
      },
    },
  ]);

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

const getSpecificUser = async (id: string) => {
  try {
    const user = await User.findById(id);
    if (!user) {
      throw new CustomError.BadRequestError('user not found');
    }
    return user;
  } catch (error) {
    throw error;
  }
};

export default {
  createUser,
  getSpecificUser,
  retrieveAllGuests,
  retrieveAllHosts,
};
