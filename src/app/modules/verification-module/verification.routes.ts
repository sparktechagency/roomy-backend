import { uploadFile } from './../../../helpers/fileUploader';
import express from 'express';
import verificationController from './verification.controller';

const verificationRouter = express.Router();

verificationRouter.post('/save/:id',uploadFile(),verificationController.verificationUserWithKyc)

export default verificationRouter;