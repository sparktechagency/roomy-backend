import  express  from "express"
import { uploadFile } from "../../../helpers/fileUploader";
import listingController from "./listing.controller";

const listingRouter = express.Router();

listingRouter.post('/create/:id',uploadFile(),listingController.createListing)

export default listingRouter;