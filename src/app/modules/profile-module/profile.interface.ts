import { Document, Types } from "mongoose"


export interface IProfile extends Document {
    user: Types.ObjectId | null,
    name:string,
    bio:string,
    gender: 'male' | 'female' | 'others'
    dofBirth: string,
    location: {
        lat:number,
        lon:number
    }
    isDeleted: boolean;
    createdAt: Date;
    updatedAt: Date;
}