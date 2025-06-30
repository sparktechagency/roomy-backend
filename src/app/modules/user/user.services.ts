import { ClientSession } from 'mongoose';
import config from '../../../config';
import { ENUM_USER_ROLE } from '../../../enums/user-role';
import withTransaction from '../../../helpers/withTransaction';
import registrationEmailTemplate from '../../../mailTemplate/registrationTemplate';
import IdGenerator from '../../../utilities/idGenerator';
import sendMail from '../../../utilities/sendEmail';
import CustomError from '../../errors';
import guestServices from '../guestProfile/guest.services';
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
};
