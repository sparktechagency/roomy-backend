import CustomError from '../../errors';
import { ISubscriptionPurchase } from './subscriptionPurchase.interface';
import { SubscriptionPurchase } from './subscriptionPurchase.model';

const createSubscriptionPurchase = async (subscriptionPurchaseData: Partial<ISubscriptionPurchase>) => {
  try {
    console.log('subscriptionPurchaseData', subscriptionPurchaseData);
    return await SubscriptionPurchase.create(subscriptionPurchaseData);
  } catch (error) {
    throw new CustomError.BadRequestError("subcriptionPurchase failed to create")
  }
};

// Get a subscription purchase by its ID
const getSubscriptionPurchaseById = async (id: string) => {
  return await SubscriptionPurchase.findById(id);
};

const getSubscriptionPurchaseBySubscriptionId = async (SubscriptionId: string) => {
  return await SubscriptionPurchase.findOne({ 'subscription.subscriptionId': SubscriptionId });
};

// Get a subscription purchase by priceId (e.g., Stripe)
const getSubscriptionPurchaseByPriceId = async (priceId: string) => {
  return await SubscriptionPurchase.findOne({ 'subscription.priceId': priceId });
};

// Get a subscription purchase by user ID
const getSubscriptionPurchaseByUserId = async (userId: string) => {
  return await SubscriptionPurchase.findOne({ user: userId }).populate('subscriptionId');
};

// Update a subscription purchase by its ID
const UpdatedSubscriptionPurchase = async (id: string, data: Partial<ISubscriptionPurchase>) => {
  return await SubscriptionPurchase.findByIdAndUpdate(id, data, { new: true });
};

export default {
  createSubscriptionPurchase,
  getSubscriptionPurchaseByUserId,
  getSubscriptionPurchaseByPriceId,
  UpdatedSubscriptionPurchase,
  getSubscriptionPurchaseById,
  getSubscriptionPurchaseBySubscriptionId,
};
