import { uploadFile } from './../../../helpers/fileUploader';

import express from 'express';
import { ENUM_USER_ROLE } from '../../../enums/enum';
import authentication from '../../middlewares/auth.middleware';
import profileController from './profile.controller';

const profileRouter = express.Router();

profileRouter.get(
  '/retrieve/:role',
  authentication(ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.SUPER_ADMIN),
  profileController.getAllProfileByRole,
);
profileRouter.get('/:id', authentication(ENUM_USER_ROLE.GUEST, ENUM_USER_ROLE.HOST), profileController.getSingleProfile);
profileRouter.patch(
  '/update/:id',
  authentication(ENUM_USER_ROLE.GUEST, ENUM_USER_ROLE.HOST),
  uploadFile(),
  profileController.updateProfile,
);
profileRouter.patch(
  '/visibility/:id',
  authentication(ENUM_USER_ROLE.GUEST, ENUM_USER_ROLE.HOST),
  profileController.changeProfileVisibility,
);

export default profileRouter;
