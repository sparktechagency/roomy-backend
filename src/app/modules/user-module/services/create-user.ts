import { ClientSession } from 'mongoose';
import config from '../../../../config';
import withTransaction from '../../../../helpers/withTransaction';
import IdGenerator from '../../../../utilities/idGenerator';
import sendMail from '../../../../utilities/sendEmail';
import CustomError from '../../../errors';
import Profile from '../../profile-module/profile.model';
import IUser from '../user.interface';
import User from '../user.model';
import { IProfile } from './../../profile-module/profile.interface';

export const createUser = async (data: IUser & IProfile) => {
  const result = await withTransaction(async (session: ClientSession) => {
    try {
      const verificationCode = IdGenerator.generateNumberId();
      const expireDate = new Date();
      expireDate.setMinutes(expireDate.getMinutes() + 30);

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

      const profileData = {
        user: newUser[0]._id,
        name: data.name,
        bio: data.bio,
        gender: data.gender,
        dofBirth: data.dofBirth,
        location: {
          lat: data.location.lat,
          lon: data.location.lon,
        },
      };

      const newProfile = await Profile.create([profileData], { session });
      if (!newProfile) {
        throw new CustomError.BadRequestError('Failed to create profile');
      }
      newUser[0].profile = newProfile[0]._id;
      await newUser[0].save({ session });

      return {
        email: userData.email,
        phone: userData.phone,
        ...profileData,
      };
    } catch (err) {
      throw err;
    }
  });

  return result; 
};


