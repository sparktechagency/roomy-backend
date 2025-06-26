import { Schema, model } from 'mongoose';
import { ENUM_SUBSCRIPTION_VALIDITY_PLAN } from '../../../enums/subscription';
import { ISubscription } from './subscription.interface';
import { ENUM_USER_ROLE } from '../../../enums/user';

const SubscriptionSchema = new Schema<ISubscription>(
  {
    title: { type: String, required: true },
    price: { type: Number, required: true },
    priceId: {type:String, required:true},
    root: {
      type: String,
      enum: [ENUM_USER_ROLE.CAR_OWNER, ENUM_USER_ROLE.BUSINESS],
      required: true,
    },
    validity: {
      type: {
        type: String,
        enum: [ENUM_SUBSCRIPTION_VALIDITY_PLAN.MONTHLY, ENUM_SUBSCRIPTION_VALIDITY_PLAN.YEARLY],
        required: true,
      },
      value: { type: Number, required: true },
      isRecurring: { type: Boolean, required: true },
    },
    features: [{ type: String }],
    isDeleted: { type: Boolean, default: false },
  },
  { timestamps: true },
);

const Subscription = model<ISubscription>('subscription', SubscriptionSchema);

export default Subscription;
