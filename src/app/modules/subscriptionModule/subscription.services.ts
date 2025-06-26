

// service class including methods for create, get specific, get all, delete order and update order status services
import { ISubscription } from './subscription.interface';
import Subscription from './subscription.model';


  const createSubscription = async(subscriptionData: ISubscription) => {
    const subscription = new Subscription(subscriptionData);
    return await subscription.save();
  }

  const getSubscriptions = async()=>{
    return await Subscription.find();
  }

  const getSubscriptionById=async(id: string) =>{
    return await Subscription.findById(id);
  }

  const updateSubscription = async(id: string, subscriptionData: ISubscription) =>{
    return await Subscription.findByIdAndUpdate(id, subscriptionData, { new: true });
  }

  const deleteSubscription = async(id: string) =>{
    return await Subscription.findByIdAndDelete(id);
  }


export default {
   createSubscription,
   getSubscriptions,
   getSubscriptionById,
   updateSubscription,
   deleteSubscription
};
