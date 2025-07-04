
import express  from "express";
import authentication from "../../middlewares/auth.middleware";
import { ENUM_USER_ROLE } from "../../../enums/user-role";
import profileController from "./profile.controller";

const profileRouter = express.Router();

profileRouter.get('/retrieve/:role',authentication(ENUM_USER_ROLE.ADMIN,ENUM_USER_ROLE.SUPER_ADMIN),profileController.getAllProfileByRole)

export default profileRouter;