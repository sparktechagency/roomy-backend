// support.interface.ts
import { Document, Types } from 'mongoose';
import { ENUM_USER_ROLE } from '../../../enums/user';

export interface ISupportMessage {
  sender: ENUM_USER_ROLE.CAR_OWNER | ENUM_USER_ROLE.EMPLOYEE | ENUM_USER_ROLE.BUSINESS | ENUM_USER_ROLE.ADMIN | ENUM_USER_ROLE.SUPER_ADMIN;
  message: string;
  sentAt?: Date;
}

export interface ISupportUser {
  id: Types.ObjectId;
  fullName: string;
  email: string;
  subscriptionTitle: string;
}

export interface ISupport extends Document {
  user: ISupportUser;
  latestSubject?: string;
  messages: ISupportMessage[];
  createdAt: Date;
  updatedAt: Date;
}
