import  { Document, Schema} from 'mongoose';


enum Gender {
  Male = 'male',
  Female = 'female',
  Other = 'other',
}

interface ISocialLinks {
  facebook: string;
  tiktok: string;
  threads: string;
  instagram: string;
  dribble:string;
}
export interface IBaseProfile extends Document {
  user: Schema.Types.ObjectId;
  firstName: string;
  lastName: string;
  bio: string;
  antecode: string;
  address: string;
  profileImage: string;
  photoGallery: string[];
  socialLinks: ISocialLinks;
  gender: Gender;
  dateOfBirth: Date;
  image: string;
  isProfileVisible:boolean
}
