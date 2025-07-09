import { Types } from 'mongoose';


export interface Booking {
  _id: Types.ObjectId;
  listingId: Types.ObjectId;
  userId: Types.ObjectId;
  occupants: number;
  checkIn: Date;
  checkOut: Date;
  extensionDays: number;
  movedInAt: Date | null;
  movedOutAt: Date | null;
  status: 'booked' | 'active' | 'completed' | 'cancelled';

  bookingType: 'direct' | 'reserve';

  paymentStatus: 'paid' | 'unpaid';

  paymentDetails?: {
    provider: string;
    paymentIntentId: string;
    amount: number;
    currency: string;
    paidAt: Date;
    receiptUrl?: string;
    refundAmount?: number; 
    refundStatus?: 'requested' | 'approved' | 'rejected' | 'completed';
    refundedAt?: Date;
  };

  // Reserve Booking 
  isInspectionScheduled: boolean;
  inspectionDate: Date | null;
  inspectionStatus: 'pending' | 'visited' | 'rescheduled' | null;

  createdAt: Date;
  updatedAt: Date;
}
