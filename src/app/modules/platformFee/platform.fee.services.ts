import PlatformFee from "./platform.fee.model";



const changePlatformFee = async (payload: {
  fees?: {
    guest?: { type: 'flat' | 'percentage'; value: number };
    host?: { type: 'flat' | 'percentage'; value: number };
  };
}) => {

  const updateFields: any = {
    updatedAt: new Date()
  };

  if (payload.fees) {
    if (payload.fees.guest) {
      updateFields['fees.guest'] = payload.fees.guest;
    }
    if (payload.fees.host) {
      updateFields['fees.host'] = payload.fees.host;
    }
  }

  const updated = await PlatformFee.findOneAndUpdate(
    {}, 
    { $set: updateFields },
    {
      new: true,
      upsert: false
    }
  );

  if (!updated) {
    throw new Error('Platform settings not found');
  }

  return updated;
};


const setDefaultPlatformFee = async () => {
  const defaultFees = {
    fees: {
      guest: { type: 'flat', value: 10 },
      host: { type: 'flat', value: 15 }
    },
    updatedAt: new Date()
  };

  const updated = await PlatformFee.findOneAndUpdate(
    {},
    { $set: defaultFees },
    { new: true, upsert: true }
  );

  return updated;
};


export default {
    changePlatformFee,
    setDefaultPlatformFee
}