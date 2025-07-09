
import mongoose from 'mongoose';
import { PlatformSettings } from './platform.fee.interface';

const platformSettingsSchema = new mongoose.Schema<PlatformSettings>({
  fees: {
    guest: {
      type: {
        type: String,
        enum: ['flat', 'percentage'],
        default: 'percentage',
        required: true,
      },
      value: {
        type: Number,
        required: true,
        default: 10,
      },
    },
    host: {
      type: {
        type: String,
        enum: ['flat', 'percentage'],
        default: 'percentage',
        required: true,
      },
      value: {
        type: Number,
        required: true,
        default: 15,
      },
    },
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

const PlatformFee = mongoose.model<PlatformSettings>('PlatformFee', platformSettingsSchema);

export default PlatformFee;
