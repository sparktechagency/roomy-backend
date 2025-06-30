import { Document, Types } from "mongoose";


interface IReview extends Document {
  user: Types.ObjectId;        
  room: Types.ObjectId;         
  ratings: {
    security: number;      
    cleanliness: number;   
    comfort: number;       
    price: number;         
  };
  comment?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export default IReview;