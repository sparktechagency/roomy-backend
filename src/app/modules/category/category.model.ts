import mongoose, { Schema } from 'mongoose';
import ICategory from './category.interface';

const categorySchema = new Schema<ICategory>(
  {
    name: { type: String, required: [true, 'name is required'] },
    categoryImage: { type: String, required: [true, 'category image is required'] },

    status: {
      type: String,
      enum: ['active', 'inactive'],
      default: 'active',
    },
  },
  {
    timestamps: true,
  },
);

const Blog = mongoose.model<ICategory>('Blog', categorySchema);
export default Blog;
