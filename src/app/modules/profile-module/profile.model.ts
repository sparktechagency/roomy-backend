import mongoose, { Types } from 'mongoose';
import { IProfile } from './profile.interface';

const profileSchema = new mongoose.Schema<IProfile>(
  {
    user: {
      type: Types.ObjectId,
      ref: 'user',
    },
    name: {
      type: String,
      required: [true, 'name is required!'],
    },
    dofBirth: {
      type: String,
      required: [true, 'date of birth is required!'],
    },
    bio: {
      type: String,
      required: false,
    },
    gender: {
      type: String,
      enum: {
        values: ['male', 'female', 'other'],
        message: `{VALUE} is not accepted as a status value. Use male/female/other.`,
      },
    },
    location: {
      lat: {
        type: Number,
        required: true,
      },
      lon: {
        type: Number,
        required: true,
      },
    },

    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  },
);

const Profile = mongoose.model<IProfile>('profile', profileSchema);

export default Profile;
