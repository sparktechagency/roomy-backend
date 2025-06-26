import { ClientSession, Types } from 'mongoose';
import config from '../../../../config';
import { ENUM_USER_ROLE } from '../../../../enums/user-role';
import withTransaction from '../../../../helpers/withTransaction';
import IdGenerator from '../../../../utilities/idGenerator';
import sendMail from '../../../../utilities/sendEmail';
import CustomError from '../../../errors';
import guestServices from '../../guest-profile-module/guest.services';
import hostServices from '../../host-profile-module/host-services';
import { IBaseProfile } from '../../profile-module/profile.interface';
import IUser from '../user.interface';
import User from '../user.model';

export const createUser = async (data: IUser & IBaseProfile, role: string) => {
  const result = await withTransaction(async (session: ClientSession) => {
    try {
      const verificationCode = IdGenerator.generateNumberId();
      const expireDate = new Date();
      expireDate.setMinutes(expireDate.getMinutes() + 30);
     
      console.log(data.dateOfBirth)

      const userData = {
        email: data.email,
        phone: data.phone,
        password: data.password,
        verification: {
          code: verificationCode,
          expireDate,
        },
      };

      const newUser: any = await User.create([userData], { session });
      console.log(newUser);
      if (!newUser) {
        throw new CustomError.BadRequestError('Failed to create user');
      }

      const mailOptions = {
        from: config.gmail_app_user,
        to: userData.email,
        subject: 'Email Verification',
        text: `Your email verification code is ${verificationCode}`,
      };
      sendMail(mailOptions);

      let profilePayload: any = {
        user: newUser[0]._id,
        firstName: data.firstName,
        lastName: data.lastName,
        gender: data.gender,
        dateOfBirth: data.dateOfBirth,
      };

      switch (role) {
        case ENUM_USER_ROLE.GUEST:
          const guestProfile = await guestServices.createGuestProfile(profilePayload, session);
          if (guestProfile) {
            newUser[0].profile.id = guestProfile._id as unknown as Types.ObjectId;
            newUser[0].profile.role = role
          }
          await newUser[0].save({ session });
          break;

        case ENUM_USER_ROLE.HOST:
          const hostProfile = await hostServices.createHostProfile(profilePayload, session);
          if (hostProfile) {
            newUser[0].profile = hostProfile._id as unknown as Types.ObjectId;
            newUser[0].profile.role = role
          }
          await newUser[0].save({ session });
          break;

        default:
          throw new CustomError.BadRequestError('Invalid role provided.');
      }
      
      const { password, verification, ...userInfo } = newUser[0].toObject();

      return {
        ...userInfo
      };
    } catch (err) {
      throw err;
    }
  });

  return result;
};
