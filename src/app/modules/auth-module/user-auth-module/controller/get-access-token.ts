import { StatusCodes } from "http-status-codes";
import sendResponse from "../../../../../shared/sendResponse";
import handleAsync from "../../../../../shared/handleAsync";
import { Request, Response } from "express";
import CustomError from "../../../../errors";
import authServices from "../auth.services";
import jwtHelpers from "../../../../../helpers/jwtHelpers";
import config from "../../../../../config";
import { Secret } from "jsonwebtoken";

const getAccessTokenByRefreshToken = handleAsync(async (req: Request, res: Response) => {
  const { refresh_token } = req.body;
  const actualRefreshToken = refresh_token.split(' ')[1];

  const tokenPayload = jwtHelpers.verifyToken(actualRefreshToken, config.jwt_refresh_token_secret as Secret);
  if (!tokenPayload) {
    throw new CustomError.BadRequestError('Invalid refresh token!');
  }

  const user = await authServices.getUserByEmail(tokenPayload.email);

  if (!user) {
    throw new CustomError.NotFoundError('User not found!');
  }

  const payload = {
    email: user.email,
    roles: user.role,
  };

  const newAccessToken = jwtHelpers.createToken(
    payload,
    config.jwt_access_token_secret as Secret,
    config.jwt_access_token_expiresin as string,
  );

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    status: 'success',
    message: 'New access token created using refresh token. User logged In successful',
    data: {
      accessToken: newAccessToken,
      refreshToken: actualRefreshToken,
    },
  });
});

export default getAccessTokenByRefreshToken