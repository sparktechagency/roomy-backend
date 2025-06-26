import BadRequestError from "./badRequest.error";
import ForbiddenError from "./forbidden.error";
import NotFoundError from "./notFound.error";
import UnAuthorizedError from "./unAuthorized.error";


const CustomError = {
  BadRequestError,
  ForbiddenError,
  NotFoundError,
  UnAuthorizedError,
};

export default CustomError;
