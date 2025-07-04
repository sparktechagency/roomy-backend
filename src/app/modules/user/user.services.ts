import mongoose, { ClientSession } from 'mongoose';
import config from '../../../config';
import { ENUM_USER_ROLE, ENUM_USER_STATUS } from '../../../enums/user-role';
import withTransaction from '../../../helpers/withTransaction';
import registrationEmailTemplate from '../../../mailTemplate/registrationTemplate';
import IdGenerator from '../../../utilities/idGenerator';
import sendMail from '../../../utilities/sendEmail';
import CustomError from '../../errors';
import { IBaseProfile } from '../profile/profile.interface';
import Profile from '../profile/profile.model';
import IUser from './user.interface';
import User from './user.model';

//
export const createUserIntoDb = async (data: IUser & IBaseProfile, role: string) => {
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
      address: data.address,
      dateOfBirth: data.dateOfBirth,
      role: data.role,
      ...(role === ENUM_USER_ROLE.HOST && { isPrimeHost: false }),
    };

    switch (role) {
      case ENUM_USER_ROLE.GUEST:
        const [guestProfile] = await Profile.create([profilePayload], {
          session,
        });
        newUser.profile.id = guestProfile._id;
        newUser.profile.role = role;
        await newUser.save({ session });
        break;

      case ENUM_USER_ROLE.HOST:
        const [hostProfile] = await Profile.create([profilePayload], {
          session,
        });
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
    setTimeout(() => sendMail(mailOptions), 0);

    return { ...userInfo };
  });

  return result;
};

const changeUserStatus = async (id: string, status: string) => {
  const user = await User.findById(id);
  if (!user) {
    throw new CustomError.BadRequestError('User not found');
  }
  if (![ENUM_USER_STATUS.ACTIVE as string, ENUM_USER_STATUS.BLOCKED as string].includes(status)) {
    throw new CustomError.BadRequestError('invalid status');
  }
  const result = await User.findByIdAndUpdate(id, { status }, { new: true, runValidators: true });
  return {
    _id: result?._id,
    email: result?.email,
    status: result?.status,
  };
};

const retrieveUserDetails = async (userId: string) => {
  const result = await User.aggregate([
    {
      $match: { _id: new mongoose.Types.ObjectId(userId) },
    },
    {
      $lookup: {
        from: 'profiles',
        localField: 'profile.id',
        foreignField: '_id',
        as: 'profile',
      },
    },
    { $unwind: '$profile' },
    {
      $project: {
        _id: 1,
        email: 1,
        profileImage: '$profile.profileImage',
        name: {
          $concat: ['$profile.firstName', ' ', '$profile.lastName'],
        },
        role: '$profile.role',
        address: '$profile.address',
      },
    },
  ]);
  console.log(result[0]);
  return result[0];
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
  createUserIntoDb,
  getSpecificUser,
  changeUserStatus,
  retrieveUserDetails,
};
