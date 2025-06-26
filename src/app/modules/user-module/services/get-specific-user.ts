import CustomError from '../../../errors';
import User from '../user.model';

export const getSpecificUser = async (id: string) => {
  try {
    const user = await User.findById(id);
    if (!user) {
      throw new CustomError.BadRequestError('user not found');
    }
    return user;
  } catch (error) {
    throw error;
  }
};
