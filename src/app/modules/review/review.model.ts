import mongoose, { Schema } from 'mongoose';

const reviewSchema = new mongoose.Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    room: {
      type: Schema.Types.ObjectId,
      ref: 'Listing',
      required: true,
    },
    ratings: {
      security: { type: Number, min: 0, max: 5, default: 0 },
      cleanliness: { type: Number, min: 0, max: 5, default:0 },
      comfort: { type: Number, min: 0, max: 5, default: 0 },
      price: { type: Number, min: 0, max: 5, default:0 },
    },
    avgRating: {
      type: Number,
      default: 0
    },
    comment: {
      type: String,
      maxlength: [1000, 'Comment must be at most 1000 characters long'],
      default: ""
    },
  },
  { timestamps: true },
);

const Review = mongoose.model('Review', reviewSchema)
export default Review;
