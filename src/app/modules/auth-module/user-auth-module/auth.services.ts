import User from "../../user-module/user.model";


// service for get user by email
const getUserByEmail = async(email: string) => {
    return await User.findOne({email}).populate({
        path: "profile",
        select: "-password -verification -__v"
    });
}

export default {
    getUserByEmail,
}
