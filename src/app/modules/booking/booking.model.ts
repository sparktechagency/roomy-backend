import { Document, Types } from "mongoose";

export interface Booking extends Document {
  _id: Types.ObjectId;

  // Core Info
  listingId: Types.ObjectId;
  userId: Types.ObjectId;
  occupants: number;

  bookingType: 'direct' | 'reserve'; 
  status: 'booked' | 'active' | 'completed' | 'cancelled';
  paymentStatus: 'paid' | 'unpaid';

  checkIn: Date;
  checkOut: Date;
  extensionDays: number;

  movedInAt: Date | null;
  movedOutAt: Date | null;

  // Payment & Refund Info
  paymentDetails?: {
    provider: 'stripe';
    paymentIntentId: string;
    amount: number;
    currency: string;
    paidAt: Date;

    // Refund-specific fields
    refundAmount?: number;
    refundStatus?: 'requested' | 'approved' | 'rejected' | 'completed';
    refundedAt?: Date;
  };

  // Reserve/Inspection Flow (only for bookingType = 'reserve')
  isInspectionScheduled: boolean;
  originalInspectionDate: Date | null; 
  inspectionDate: Date | null;
  inspectionStatus: 'pending' | 'visited' | 'rescheduled' | null;

  lastRescheduledAt: Date | null; 
  inspectionRescheduleHistory?: Array<{
    previousDate: Date;
    newDate: Date;
    rescheduledAt: Date;
  }>;

  // Cancellation Info
  cancellationDetails?: {
    reason?: string;
    cancelledAt: Date;
    cancelledBy: 'user' | 'admin';
  };

  // Timestamps
  createdAt: Date;
  updatedAt: Date;
}
