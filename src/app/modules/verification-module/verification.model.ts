import mongoose, { Schema} from 'mongoose';
import { IVerification } from './verification.interface';

const verificationSchema = new Schema<IVerification>({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  country: { type: String, default: '' },
  verificationType: {
    type: String,
    enum: {
      values: ['id', 'passport', 'driver license'],
      message: '{VALUE} is not accepted as a role value. Use business/carOwner/employee.',
    },
    default: null,
  },
  verificationImage: {
    type: {
      frontPart: { type: String, default: '' },
      backPart: { type: String, default: '' },
       _id: false,
    },
    default: {},
  },
  isFaceVerified: { type: Boolean, default: false },
  
},
  {
    timestamps: true
  }
);

const verification = mongoose.model<IVerification>('verification', verificationSchema);

export default verification;
