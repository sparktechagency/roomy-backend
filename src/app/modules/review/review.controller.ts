import { Request, Response } from "express";
import handleAsync from "../../../shared/handleAsync";
import reviewServices from "./review.services";
import sendResponse from "../../../shared/sendResponse";
import { StatusCodes } from "http-status-codes";


const addUserReview = handleAsync(async(req:Request,res:Response)=>{
   const data = req.body;
   const result = await reviewServices.addReviewIntoDb(data);
    sendResponse(res, {
    statusCode: StatusCodes.CREATED,
    status: 'success',
    message: 'review has been created succesfully',
    data: result,
  });
})

export default {
    addUserReview
}