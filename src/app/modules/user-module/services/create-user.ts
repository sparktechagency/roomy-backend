import { ClientSession, Types } from 'mongoose';
import config from '../../../../config';
import { ENUM_USER_ROLE } from '../../../../enums/user-role';
import withTransaction from '../../../../helpers/withTransaction';
import registrationEmailTemplate from '../../../../mailTemplate/registrationTemplate';
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

    let profile;

    switch (role) {
      case ENUM_USER_ROLE.GUEST:
        console.time('Profile.create');
        profile = await guestServices.createGuestProfile(profilePayload, session);
        console.timeEnd('Profile.create');
        break;

      case ENUM_USER_ROLE.HOST:
        profile = await hostServices.createHostProfile(profilePayload, session);
        break;

      default:
        throw new CustomError.BadRequestError('Invalid role provided.');
    }


    await User.findByIdAndUpdate(
      newUser._id,
      {
        profile: {
          id: profile._id,
          role,
        },
      },
      { session }
    );


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
