
import { Types,Document } from "mongoose";

export enum PaymentStatus {
  Pending = 'pending',
  Success = 'success',
  Failed = 'failed',
}

export enum PaymentSourceType {
  Visa = 'visa',
  Master = 'master',
  AmericanExpress = 'AmericanExpress'
}

export interface PaymentSource {
  source: string;
  type: PaymentSourceType;
  isSaved: boolean;
}

export interface Subscription {
   subscriptionId:string,
   priceId:string
}

export interface ISubscriptionPurchase extends Document {
  user: Types.ObjectId;
  subscriptionPlan: Types.ObjectId
  subscription: Subscription;
  paymentStatus: PaymentStatus;
  paymentSource: PaymentSource;
  isActive: boolean;
}

export default ISubscriptionPurchase