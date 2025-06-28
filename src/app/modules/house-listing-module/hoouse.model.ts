import mongoose, { Schema } from 'mongoose';
import IListing from './house.interface';


const roomSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    single: { type: Number, default: 0 },
    double: { type: Number, default: 0 },
    queen: { type: Number, default: 0 },
    king: { type: Number, default: 0 },
  },
  { _id: false },
);

const listingSchema = new mongoose.Schema<IListing>({
  user: { type: Schema.Types.ObjectId, ref: 'User' },
  roomType: { type: String, required: true },
  isFurnished: { type: String },
  title: { type: String, required: [true, 'title is required'] },
  description: {
    type: String,
    required: [true, 'Description is required'],
    minlength: [50, 'Description must be at least 10 characters long'],
    maxlength: [200, 'Description must be at most 500 characters long'],
  },

  city: { type: String, required: [true, 'city is required'] },
  address: {
    type: {
      name: { type: String, required: [true, 'name is required'] },
      location: {
        type: {
          lat: { type: Number, required: [true, 'latitude is required'] },
          lon: { type: Number, required: [true, 'longitude is required'] },
        },
        required: true,
      },
      postCode: { type: String, required: [true, 'post code is required'] },
    },
    required: true,
  },

  state: { type: String, required: [true, 'state is required'] },

  roomAvailability: {
    type: {
      from: { type: Date, required: true },
      to: { type: Date, required: true },
    },
  },

  stay: {
    type: {
      minimum: { type: String, required: [true, 'minimum time is required'] },
      maximum: { type: String, required: [true, 'maximum time is required'] },
    },
  },

  pricing: {
    type: {
      weeklyRent: { type: Number, required: [true, 'weekly rent is required'] },
      bondAmount: { type: Number, required: [true, 'name is required'] },
    },
  },

  beds: {
    type: {
      single: { type: Number, default: 0 },
      double: { type: Number, default: 0 },
      queen: { type: Number, default: 0 },
      king: { type: Number, default: 0 },
    },
  },

  guests: {
    totalMale: { type: Number, default: 0 },
    totalFemale: { type: Number, default: 0 },
  },

  roomGallery: {
    type: [String],
    required: [true, 'room image is required'],
  },

  rooms: {
    totalRooms: { type: Number, default: 0 },
    list: {
      type: [roomSchema],
      default: [],
    },
    default: {},
  },

  totalBathrooms: { type: Number, required: [true, 'total bathroom is required'] },
  bathroomType: { type: String, required: [true, 'bathroom type is required'] },
  isLiftAvailable: { type: Boolean, default: true },
  isParking: { type: Boolean, required: [true, 'parking is required'] },
  isBuildingAmenities: { type: Boolean, required: [true, 'isBuilding amenities is required'] },
  BuildingAmenities: {
    type: [String],
    required: true,
  },

  amenities: {
    type: {
      roomEquipments: {
        type: [String],
        required: true,
      },
      propertyEquipments: {
        type: [String],
        required: true,
      },
    },
  },

  preferPerson: { type: String, enum: ['male', 'female', 'both'] },
  preferredAgeGroup: { type: Number, required: true },
  isAcceptSmoke: { type: Boolean, required: true },
  houseRules: [{ type: String, required: true }],
  inspection: [{ type: String, required: true }],
  isEnableCancellation: { type: Boolean, required: true },
  refundPolicy: [{ type: String , default:[]}],
  review:{
     type: Schema.Types.ObjectId,
     ref: 'Review'
  }
});

const Listing = mongoose.model<IListing>('Listing', listingSchema);
export default Listing;
