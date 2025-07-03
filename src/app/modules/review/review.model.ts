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
      required: false
    },
    comment: {
      type: String,
      maxlength: [1000, 'Comment must be at most 1000 characters long'],
      default: ""
    },
  },
  { timestamps: true },
);

reviewSchema.virtual('averageRating').get(function (this: any) {
  const ratings = this.ratings as {
    security?: number;
    cleanliness?: number;
    comfort?: number;
    price?: number;
  };

  const values = [
    ratings.security ?? 0,
    ratings.cleanliness ?? 0,
    ratings.comfort ?? 0,
    ratings.price ?? 0,
  ].filter(v => v > 0);

  if (values.length === 0) return 0;
  return values.reduce((acc, val) => acc + val, 0) / values.length;
});

reviewSchema.set('toObject', { virtuals: true });
reviewSchema.set('toJSON', { virtuals: true });



const Review = mongoose.model('Review', reviewSchema)
export default Review;
