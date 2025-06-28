import { Document, Types } from 'mongoose';

interface IRoom {
  name: string;
  single?: number;
  double?: number;
  queen?: number;
  king?: number;
}

interface IAddress {
  name: string;
  location: {
    lat: number;
    lon: number;
  };
  postCode: string;
}

interface IRoomAvailability {
  from: Date;
  to: Date;
}

interface IStay {
  minimum: string;
  maximum: string;
}

interface IPricing {
  weeklyRent: number;
  bondAmount: number;
}

interface IBeds {
  single?: number;
  double?: number;
  queen?: number;
  king?: number;
}

interface IGuests {
  totalMale?: number;
  totalFemale?: number;
}

interface IAmenities {
  roomEquipments: string[];
  propertyEquipments: string[];
}

interface IReview {
  user: Types.ObjectId;
}

interface IRooms {
  totalRooms?: number;
  list?: IRoom[];
}

interface IListing extends Document {
  user?: Types.ObjectId;
  roomType: string;
  isFurnished?: string;
  title: string;
  description: string;
  city: string;
  address: IAddress;
  state: string;
  roomAvailability?: IRoomAvailability;
  stay?: IStay;
  pricing?: IPricing;
  beds?: IBeds;
  guests?: IGuests;
  roomGallery: string[];
  rooms?: IRooms;
  totalBathrooms: number;
  bathroomType: string;
  isLiftAvailable?: boolean;
  isParking: boolean;
  isBuildingAmenities: boolean;
  BuildingAmenities: string[];
  amenities: IAmenities;
  preferPerson?: 'male' | 'female' | 'both';
  preferredAgeGroup: number;
  isAcceptSmoke: boolean;
  houseRules: string[];
  inspection: string[];
  isEnableCancellation: boolean;
  refundPolicy?: string[];
  review: Types.ObjectId;
  createdAt: Date,
  updatedAt: Date
}

export default IListing;

