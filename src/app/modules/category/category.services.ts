import { ENUM_USER_ROLE } from '../../../enums/user-role';
import CustomError from '../../errors';
import ICategory from './category.interface';
import Category from './category.model';

const createCategoryIntoDb = async (data: ICategory, file: any) => {
  const categoryImage = file.category_image?.[0].path;
  const categoryData = { ...data, categoryImage };
  const result = await Category.create(categoryData);
  if (!result) {
    throw new CustomError.BadRequestError('failed to create category');
  }
  return result;
};

const retrieveAllCategory = async (role: string) => {
  let result;
  if (role === ENUM_USER_ROLE.SUPER_ADMIN || role === ENUM_USER_ROLE.ADMIN) {
    result = await Category.aggregate([
      {
        $match: {},
      },
    ]);
  } else {
    result = await Category.aggregate([
      {
        $match: { status: 'active' },
      },
    ]);
  }
  return result;
};

const updateCategory = async (id: string, data: Partial<ICategory>) => {
  const result = await Category.findByIdAndUpdate(id, data, { new: true });
  if (!result) {
    throw new CustomError.BadRequestError('Failed to update category');
  }
  return result;
};

const deleteCategory = async (id: string) => {
  const result = await Category.findByIdAndDelete(id);
  if (!result) {
    throw new CustomError.BadRequestError('Failed to delete category');
  }
  return result;
};

export default {
  createCategoryIntoDb,
  retrieveAllCategory,
  updateCategory,
  deleteCategory
};
