import { ClientSession } from 'mongoose';
import withTransaction from '../../../helpers/withTransaction';
import CustomError from '../../errors';
import IReview from './review.interface';
import Review from './review.model';
import Listing from '../listing/listing.model';
import IListing from '../listing/listing.interface';

const addReviewIntoDb = async (data: IReview) => {
  return withTransaction(async (session: ClientSession) => {
    const ratings = data.ratings as {
      security?: number;
      cleanliness?: number;
      comfort?: number;
      price?: number;
    };

    const values = [ratings.security ?? 0, ratings.cleanliness ?? 0, ratings.comfort ?? 0, ratings.price ?? 0].filter((v) => v > 0);
    const averageRating = values.reduce((acc, val) => acc + val, 0) / values.length;

    const [review] = await Review.create([{ ...data, avgRating: averageRating }], { session });
    if (!review) {
      throw new CustomError.BadRequestError('failed to create review');
    }

    const listing:any = await Listing.findById(data.room).session(session);
    if (!listing) {
      throw new CustomError.NotFoundError('Listing not found');
    }

    const previousTotal = listing.reviews?.totalReviews || 0;
    const previousAvg = listing.reviews?.averageRating || 0;


    const newTotal = previousTotal + 1;
    const newAvg = (previousAvg * previousTotal + averageRating) / newTotal;

   
    listing.reviews = {
      totalReviews: newTotal,
      averageRating: newAvg,
    };

    await listing.save({ session });

    return review;
  });
};

export default {
  addReviewIntoDb,
};
