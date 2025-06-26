import { ClientSession } from "mongoose";
import hostProfile from "./host-model";
import { IHostProfile } from "./host-interface";


const createHostProfile = async (data: IHostProfile, session?: ClientSession) => {
  return await new hostProfile(data).save({ session });
};

export default {
    createHostProfile
}