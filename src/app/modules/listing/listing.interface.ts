import { Document, Types, Schema } from 'mongoose';

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

interface IInspection {
  dateOfVisit: Date;
  hoursOfVisit: string; // Example: "10:00 AM - 12:00 PM"
}

interface IRooms {
  totalRooms?: number;
  list?: IRoom[];
}

interface IReview {
  totalReviews: number;
  avgRating: number;
}


interface IListing extends Document {
  host?: Types.ObjectId;
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
  buildingAmenities: string[];
  amenities: IAmenities;
  preferPerson?: 'male' | 'female' | 'both';
  preferredAgeGroup: number;
  isAcceptSmoke: boolean;
  houseRules: string[];
  inspection: IInspection[];
  isEnableCancellation: boolean;
  refundPolicy?: string[];
  reviews: IReview;
  createdAt: Date,
  updatedAt: Date
}

export default IListing;

