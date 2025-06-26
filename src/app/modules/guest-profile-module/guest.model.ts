import mongoose, { Schema } from 'mongoose';
import { IGuestProfile } from './guest.interface';

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

const guestProfileSchema = new Schema<IGuestProfile>(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User' },

    firstName: { type: String, required: [true, 'First name is required'] },
    lastName: { type: String, required: [true, 'Last name is required'] },

    gender: {
      type: String,
      enum: ['male', 'female', 'other'],
      required: [true, 'Gender is required'],
    },

    dateOfBirth: { type: Date, required: [true, 'Date of birth is required'] },

    // Optional fields
    bio: {type: String, default: ''} ,
    antecode: {type: String, default: ''} ,
    profileImage: {type: String, default: ''} ,
    photoGallery: {type:[String], default:[]},
    socialLinks: {
      type: socialLinksSchema,
      default: {},
    },
    image: {type: String, default: ''} ,
    country: {type: String, default: ''} ,
    verificationType: {type: String, default: ''},
    verificationImage: {type: String, default: ''},
    isfaceVerified: { type: Boolean, default: false },
    isProfileVisible: { type: Boolean, default: true },
  },
  {
    timestamps: true,
  },
);


const guestProfile = mongoose.model<IGuestProfile>('guestProfile', guestProfileSchema);

export default guestProfile;
