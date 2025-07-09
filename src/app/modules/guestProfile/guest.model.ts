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
    address: { type: String, required: [true, 'adress is required'] },

    // Optional fields
    bio: { type: String, default: '' },
    antecode: { type: String, default: '' },
    profileImage: { type: String, default: '' },
    photoGallery: { type: [String], default: [] },
    socialLinks: {
      type: socialLinksSchema,
      default: {},
    },
    isProfileVisible: { type: Boolean, default: true },
  },
  
  {
    timestamps: true,
  },
);

const GuestProfile = mongoose.model<IGuestProfile>('GuestProfile', guestProfileSchema);

export default GuestProfile;
