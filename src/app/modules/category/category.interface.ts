

import { Document } from 'mongoose';

interface ICategory extends Document {
  name: string;
  categoryImage: string;
  status?: 'active' | 'inactive';
  createdAt?: Date;
  updatedAt?: Date;
}

export default ICategory;
