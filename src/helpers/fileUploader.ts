/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/ban-ts-comment */

import { Request } from 'express';
import fs from 'fs';
import multer from 'multer';

export const uploadFile = () => {
  const allowedFileTypesForImages = ['image/jpeg', 'image/png', 'image/jpg', 'image/webp', 'image/svg+xml'];

  // Storage
  const storage = multer.diskStorage({
    destination: function (_req, file, cb) {
      let uploadPath = '';
      console.log(file);
      if (file.fieldname === 'profile_image') {
        uploadPath = 'uploads/profile_image';
      } else if (file.fieldname === 'room_gallery') {
        uploadPath = 'uploads/room_images';
      } else if (file.fieldname === 'blog_image') {
        uploadPath = 'uploads/blog_image';
      }else if(file.fieldname === 'category_image'){
        uploadPath = 'uploads/category_image';
      }else if (file.fieldname === 'front_part') {
        uploadPath = 'uploads/front_images';
      }else if (file.fieldname === 'profile_gallery') {
        uploadPath = 'uploads/profile_gallery';
      } else if (file.fieldname === 'back_part') {
        uploadPath = 'uploads/back_images';
      } else {
        uploadPath = 'uploads';
      }

      if (!fs.existsSync(uploadPath)) {
        fs.mkdirSync(uploadPath, { recursive: true });
      }

      cb(null, uploadPath);
    },

    filename: function (_req, file, cb) {
      const name = Date.now() + '-' + file.originalname;
      cb(null, name);
    },
  });

  // File filter
  const fileFilter = (_req: Request, file: any, cb: any) => {
    const allowedFieldnames = ['profile_image', 'profile_gallery', 'room_gallery','category_image', 'blog_image', 'front_part', 'back_part'];

    if (!file.fieldname) {
      return cb(null, true);
    }

    if (!allowedFieldnames.includes(file.fieldname)) {
      return cb(new Error('Invalid fieldname'));
    }

    if (allowedFileTypesForImages.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed for this field'));
    }
  };

  // Upload handler
  const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
  }).fields([
    { name: 'profile_image', maxCount: 1 },
    { name: 'profile_gallery', maxCount: 20},
    { name: 'room_gallery', maxCount: 10 },
    { name: 'blog_image', maxCount: 1 },
    { name: 'category_image', maxCount: 1 },
    { name: 'front_part', maxCount: 1 },
    { name: 'back_part', maxCount: 1 },
  ]);

  return upload;
};
