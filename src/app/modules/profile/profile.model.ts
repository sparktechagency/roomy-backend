import mongoose, { Schema } from 'mongoose';
import { IBaseProfile } from './profile.interface';
import { ENUM_USER_ROLE } from '../../../enums/user-role';

const socialLinksSchema = new Schema(
  {
    facebook: { type: String, default: '' },
    threads: { type: String, default: '' },
    tiktok: { type: String, default: '' },
    instagram: { type: String, default: '' },
    dribble: { type: String, default: '' },
  },
  { _id: false },
);

const profileSchema = new Schema<IBaseProfile>(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User' },

    firstName: { type: String, required: [true, 'First name is required'] },
    lastName: { type: String, required: [true, 'Last name is required'] },

    gender: {
      type: String,
      enum: ['male', 'female', 'other'],
      required: [true, 'Gender is required'],
    },
    role: {
      type: String,
      enum: [ENUM_USER_ROLE.GUEST, ENUM_USER_ROLE.HOST],
      required: [true, 'role is required'],
    },
    address: { type: String, required: [true, 'adress is required'] },
    dateOfBirth: { type: Date, required: [true, 'Date of birth is required'] },

    // Optional fields
    bio: { type: String, default: '' },
    antecode: { type: String, default: '' },
    profileImage: { type: String, default: '' },
    photoGallery: { type: [String], default: [] },
    socialLinks: {
      type: socialLinksSchema,
      default: {},
    },
    image: { type: String, default: '' },
    isPrimeHost: { type: Boolean },
  },
  {
    timestamps: true,
  },
);

const Profile = mongoose.model<IBaseProfile>('Profile', profileSchema);
export default Profile;
