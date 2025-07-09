import IListing from './listing.interface';
import Listing from './listing.model';

const createListingIntoDb = async (id: string, data: IListing, files: any) => {
  const roomImages = files.room_gallery?.map((file: Express.Multer.File) => file.path) || [];

  const newListingData = {
    ...data,
    roomGallery: roomImages,
  };
  const newListing = await Listing.create(newListingData);

  return newListing;
};

const retrieveSpecificListings = async (
  query: Record<string, any>,
): Promise<{
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  data: any[];
}> => {
  const matchStage: any = {};

  // 1. City filter
  if (query.city) {
    matchStage.city = {
      $regex: new RegExp(`^${query.city.trim()}$`, 'i'), // Case-insensitive match
    };
  }

  // Room Type filter
  if (query.roomType && query.roomType !== 'all') {
    matchStage.roomType = query.roomType;
  } else {
    matchStage.roomType = { $in: ['shared', 'private', 'apartment'] };
  }

  // Price range
  if (query.minPrice || query.maxPrice) {
    matchStage['pricing.weeklyRent'] = {};
    if (query.minPrice) {
      matchStage['pricing.weeklyRent'].$gte = Number(query.minPrice);
    }
    if (query.maxPrice) {
      matchStage['pricing.weeklyRent'].$lte = Number(query.maxPrice);
    }
  }

  // Utilities
  if (query.utilities) {
    matchStage.utilities = query.utilities;
  }

  //Amenities (room + property equipments)
  const amenitiesConditions: any[] = [];
  if (query.amenities) {
    const requestedAmenities = Array.isArray(query.amenities) ? query.amenities : query.amenities.split(',');

    for (const key of requestedAmenities) {
      amenitiesConditions.push({ [`amenities.roomEquipments.${key}`]: true }, { [`amenities.propertyEquipments.${key}`]: true });
    }
  }
   console.log(matchStage)
  //Combine match with amenities (if any)
  const finalMatchStage = amenitiesConditions.length > 0 ? { $and: [matchStage, { $or: amenitiesConditions }] } : matchStage;

  //Pagination setup
  const page = Number(query.page) > 0 ? Number(query.page) : 1;
  const limit = Number(query.limit) > 0 ? Number(query.limit) : 20;
  const skip = (page - 1) * limit;

  //Aggregation Pipeline
  const pipeline: any[] = [
   { $match: finalMatchStage },
  { $sort: { createdAt: -1 } },
  {
    $facet: {
      data: [
        { $skip: skip },
        { $limit: limit },
        {
          $project: {
            _id: 1,
            roomType: 1,
            minStay: '$stay.minimum',
            title: 1,
            rating: '$reviews.averageRating',
            pricePerWeek: '$pricing.weeklyRent',
            bond: '$pricing.bondAmount',
            description: 1,
            guests: {
              $add: ['$guests.totalMale', '$guests.totalFemale']
            },
            city: 1
          }
        }
      ],
      meta: [{ $count: 'total' }]
    }
  },
  {
    $unwind: {
      path: '$meta',
      preserveNullAndEmptyArrays: true
    }
  },
  {
    $addFields: {
      'meta.total': { $ifNull: ['$meta.total', 0] }
    }
  }
  ];

  const result = await Listing.aggregate(pipeline);
  console.log(result)
  const total = result[0]?.meta?.total || 0;
  const totalPages = Math.ceil(total / limit);

  return {
    meta: {
      page,
      limit,
      total,
      totalPages,
    },
    data: result[0]?.data || [],
  };
};

export default {
  createListingIntoDb,
  retrieveSpecificListings,
};
