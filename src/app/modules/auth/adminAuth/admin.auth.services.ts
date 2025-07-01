import Admin from '../../admin/admin.model';

// service for get user by email
const getAdminByEmail = async (email: string) => {
  return await Admin.findOne({ email });
};

export default {
  getAdminByEmail,
};
