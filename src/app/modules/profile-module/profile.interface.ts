import { Document, Types} from "mongoose"

enum Gender {
    Male = 'male',
    Female = 'female',
    Other = 'other',
  }

  interface ISocialLinks {
  facebook: string;
  twitter: string;
  linkedin: string;
  instagram: string;
}
export interface IBaseProfile extends Document {
  user:Types.ObjectId;
  firstName: string;
  lastName: string;
  bio: string;
  antecode: string;
  profileImage: string;
  photoGallery: string[];
  socialLinks: ISocialLinks;
  gender: Gender;
  dateOfBirth: Date;
  image: string;
  country: string;
  verificationType: string;
  verificationImage: string;
  isfaceVerified: boolean;
  isProfileVisible: boolean;
}
