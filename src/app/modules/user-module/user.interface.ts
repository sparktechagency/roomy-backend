

import { Document, Types } from 'mongoose';

interface IUser extends Document {
  _id: Types.ObjectId;
  email: string;
  phone: string;
  password: string;
  status: string;
  isEmailVerified: boolean;
  verification?: {
    code: string;
    expireDate: Date;
  };
  isDeleted: boolean;
  activeSubscription: {
    id: Types.ObjectId | null;
    title: string;
  };
   stripeCustomerId: {
      type: String,
      default: null,
    },
  role: String,
  profile: Types.ObjectId | null
  createdAt: Date;
  updatedAt: Date;

  // method declarations
  comparePassword(userPlanePassword: string): boolean
  compareVerificationCode(userPlaneCode: string): boolean;
}

export default IUser;
