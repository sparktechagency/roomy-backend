import { Schema, model } from 'mongoose';

import { ISubscriptionPurchase, PaymentSourceType, PaymentStatus } from './subscriptionPurchase.interface';

const subscriptionPurchaseSchema = new Schema<ISubscriptionPurchase>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'user',
      required: true,
    },
    subscriptionPlan: {
      type: Schema.Types.ObjectId,
      ref: 'subscription',
      required: true,
    },
    subscription: {
      subscriptionId: {
        type: String,
        required: true,
      },
      priceId: {
        type: String,
        required: true,
      },
    },
    paymentStatus: {
      type: String,
      enum: Object.values(PaymentStatus),
      required: true,
    },
    paymentSource: {
      source: {
        type: String,
        required: true,
      },
      type: {
        type: String,
        enum: Object.values(PaymentSourceType),
        required: true,
      },
      isSaved: {
        type: Boolean,
        default: false,
      },
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  },
);

export const SubscriptionPurchase = model<ISubscriptionPurchase>('subscriptionPurchase', subscriptionPurchaseSchema);
