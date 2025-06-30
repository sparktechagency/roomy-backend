import { Types } from "mongoose";

enum verificationType {
  ID = 'id',
  PASSPORT = 'passport',
  LICENSE = 'driver license',
}
export interface IVerification extends Document {
  user: Types.ObjectId;
  country: string;
  verificationType: verificationType;
  verificationImage: {
    frontPart: string;
    backPart: string;
     _id: false,
  };
  isFaceVerified: boolean;
  createdAt: Date;
  updatedAt: Date;
}
