import changePassword from "./change-password";
import getAccessTokenByRefreshToken from "./get-access-token";
import userLogin from "./login-user";
import resendEmailVerificationCode from "./resend-email-verify";
import resetPassword from "./reset-password";
import sendOTP from "./send-otp";
import userEmailVerify from "./user-email-verify";
import verifyOTP from "./verify-otp";


const authControllers = {
    userLogin,
    changePassword,
    verifyOTP,
    resendEmailVerificationCode,
    resetPassword,
    sendOTP,
    userEmailVerify,
    getAccessTokenByRefreshToken
}

export default authControllers