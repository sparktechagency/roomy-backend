import { IVerification } from './verification.interface';
import verification from './verification.model';

export const saveVerificationUserWithKyc = async (id: string, data: IVerification, files: any): Promise<IVerification> => {
  console.log(data);
  const frontPartUrl = files.front_part?.[0];
  console.log(frontPartUrl);
  const backPartUrl = files.back_part?.[0];
  const existing = await verification.findOne({ user: id });
  if (existing) {
    throw new Error('Verification already exists for this user.');
  }

  // Save to DB
 const result =  await verification.create({
    user: id,
    country: data.country,
    verificationType: data.verificationType,
    verificationImage: {
      frontPart: frontPartUrl.path,
      backPart: backPartUrl.path || '',
    },
    isFaceVerified: data.isFaceVerified,
  });

  return result;
};

export default {
  saveVerificationUserWithKyc,
};
