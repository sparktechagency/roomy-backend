import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import handleAsync from '../../../shared/handleAsync';
import sendResponse from '../../../shared/sendResponse';
import feedbackService from './feedback.services';

const createFeedBack = handleAsync(async (req: Request, res: Response) => {
  const result = await feedbackService.createFeedBack(req?.user?.profileId, req?.body);
  sendResponse(res, {
    statusCode: StatusCodes.CREATED,
    status: 'success',
    message: 'Feedback send  successfully',
    data: result,
  });
});

//
const replyFeedback = handleAsync(async (req, res) => {
  const result = await feedbackService.replyFeedback(req?.params?.id, req?.body?.replyMessage);
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    status: 'success',
    message: 'Feedback replied  successfully',
    data: result,
  });
});
const deleteFeedback = handleAsync(async (req, res) => {
  const result = await feedbackService.deleteFeedbackFromDB(req?.params?.id);
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    status: 'success',
    message: 'Feedback deleted  successfully',
    data: result,
  });
});

// get all feedback
const getAllFeedback = handleAsync(async (req, res) => {
  const result = await feedbackService.getAllFeedback(req?.query);
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    status: 'success',
    message: 'Feedback retrieved  successfully',
    data: result,
  });
});

const feedbackController = {
  createFeedBack,
  replyFeedback,
  deleteFeedback,
  getAllFeedback,
};

export default feedbackController;
