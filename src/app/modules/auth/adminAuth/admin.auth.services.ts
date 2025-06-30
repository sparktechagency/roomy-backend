import Admin from '../../admin/admin.model';

// service for get user by email
const getUserByEmail = async (email: string) => {
  return await Admin.findOne({ email }).populate({
    path: 'profile',
    select: '-password -verification -__v',
  });
};

export default {
  getUserByEmail,
};
