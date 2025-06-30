import { ClientSession } from "mongoose";

import { IHostProfile } from "./host-interface";
import HostProfile from "./host-model";


const createHostProfile = async (data: IHostProfile, session?: ClientSession) => {
  return await new HostProfile(data).save({ session });
};

export default {
    createHostProfile
}