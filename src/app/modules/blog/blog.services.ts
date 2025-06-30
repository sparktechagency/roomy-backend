import CustomError from '../../errors';
import IBlog from './blog.interfaces';
import Blog from './blog.model';

export const createBlog = async (data: IBlog, file: any) => {
  console.log(file);
  const blogData = { ...data, image: file.blog_image?.[0].path };
  const result = await Blog.create(blogData);
  if (!result) {
    throw new CustomError.BadRequestError('failed to create blog');
  }
  return result;
};

export const updateBlog = async (id: string, data: Partial<IBlog>) => {
  const result = await Blog.findByIdAndUpdate(id, data, { new: true });
  if (!result) {
    throw new CustomError.BadRequestError('Failed to update');
  }
  return result;
};

const deleteBlog = async (id: string) => {
  const result = await Blog.findByIdAndDelete(id);
  if (!result) {
    throw new CustomError.BadRequestError('Failed to delete');
  }
  return result;
};

const retrieveAllBlogsByRole = async (
  query: Record<string, any>,
): Promise<{
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  data: any[];
}> => {
  const page = parseInt(query.page as string) || 1;
  const limit = parseInt(query.limit as string) || 10;
  const skip = (page - 1) * limit;
  const searchTerm = (query.searchTerm as string)?.trim() || '';
  const role = query.role || 'guest';

  const matchStage: any = {};

  if (searchTerm) {
    matchStage.$or = [
      { title: { $regex: searchTerm, $options: 'i' } },
      { category: { $regex: searchTerm, $options: 'i' } },
      { status: { $regex: searchTerm, $options: 'i' } },
    ];
  }

  if (role === 'guest') {
    matchStage.viewrs = { $in: ['guest', 'both'] };
  } else if (role === 'host') {
    matchStage.viewrs = { $in: ['host', 'both'] };
  }

  const result = await Blog.aggregate([
    { $match: matchStage },
    {
      $facet: {
        data: [{ $sort: { createdAt: -1 } }, { $skip: skip }, { $limit: limit }],
        totalCount: [{ $count: 'count' }],
      },
    },
  ]);

  const data = result[0]?.data || [];
  const total = result[0]?.totalCount[0]?.count || 0;

  return {
    meta: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
    data,
  };
};

const getAllBlogs = async (
  query: Record<string, any>,
): Promise<{
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  data: any[];
}> => {
  const page = parseInt(query.page as string) || 1;
  const limit = parseInt(query.limit as string) || 10;
  const skip = (page - 1) * limit;

  const result = await Blog.aggregate([
    {
      $match: {
        status: 'published',
      },
    },
    {
      $facet: {
        data: [{ $sort: { createdAt: -1 } }, { $skip: skip }, { $limit: limit }],
        totalCount: [{ $count: 'count' }],
      },
    },
  ]);

  const data = result[0]?.data || [];
  const total = result[0]?.totalCount[0]?.count || 0;

  return {
    meta: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
    data,
  };
};

const retrieveRecentBlogs = async (limit: number) => {
  const result = await Blog.aggregate([{ $match: { status: 'published' } }, { $sort: { createdAt: -1 } }, { $limit: limit }]);
  return result;
};

export default {
  createBlog,
  updateBlog,
  deleteBlog,
  retrieveAllBlogsByRole,
  retrieveRecentBlogs,
  getAllBlogs,
};
