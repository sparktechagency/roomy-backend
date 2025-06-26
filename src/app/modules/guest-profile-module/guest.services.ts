import { ClientSession } from "mongoose";
import { IGuestProfile } from "./guest.interface";
import guestProfile from "./guest.model";


const createGuestProfile = async (data: IGuestProfile, session?: ClientSession) => {
  return await new guestProfile(data).save({ session });
};

export default {
    createGuestProfile
}