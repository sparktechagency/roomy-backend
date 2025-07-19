

import { Document, Types } from 'mongoose';

interface IUser extends Document {
  _id: Types.ObjectId;
  email: string;
  phone: string;
  password: string;
   profile: {
    id: Types.ObjectId;
    role: string;
  };
  status: string;
  isEmailVerified: boolean;
  isVerifiedId: boolean;
  stripeCustomerId: string
  stripeAccountId?:string;
  verification?: {
    code: string;
    expireDate: Date;
  };
  isDeleted: boolean;
  createdAt: Date;
  updatedAt: Date;

  // method declarations
  comparePassword(userPlanePassword: string): boolean
  compareVerificationCode(userPlaneCode: string): boolean;
}

export default IUser;
