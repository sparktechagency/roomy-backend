import { ClientSession } from "mongoose";
import { IGuestProfile } from "./guest.interface";
import GuestProfile from "./guest.model";



const createGuestProfile = async (data: IGuestProfile, session?: ClientSession) => {
  return await new GuestProfile(data).save({ session });
};

export default {
    createGuestProfile
}