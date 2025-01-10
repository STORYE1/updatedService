const AuthService = require('../services/authService');
const { successResponse, failureResponse } = require('../utils/responseHandler');

class AuthController {
    constructor() {
        this.authService = new AuthService();
    }

    async signup(req, res) {
        console.log("i am here in controller")
        try {
            const { email, phone, userType } = req.body;
            if (!userType || !['guide', 'consumer'].includes(userType)) {
                return failureResponse(res, 400, "Invalid userType. Must be 'guide' or 'consumer'.");
            }

            const result = await this.authService.signup(email, phone, userType);
            return successResponse(res, 200, result.message);
        } catch (error) {
            return failureResponse(res, 500, error.message);
        }
    }

    async verifyOtp(req, res) {
        try {
            const { email, otp, userType } = req.body;
            if (!userType || !['guide', 'consumer'].includes(userType)) {
                return failureResponse(res, 400, "Invalid userType. Must be 'guide' or 'consumer'.");
            }

            const result = await this.authService.verifyOtp(email, otp, userType);
            return successResponse(res, 200, result.message, { token: result.token });
        } catch (error) {
            return failureResponse(res, 500, error.message);
        }
    }

    async loginRequest(req, res) {
        try {
            const { email, userType } = req.body;
            if (!userType || !['guide', 'consumer'].includes(userType)) {
                return failureResponse(res, 400, "Invalid userType. Must be 'guide' or 'consumer'.");
            }

            const result = await this.authService.loginRequest(email, userType);
            return successResponse(res, 200, result.message);
        } catch (error) {
            return failureResponse(res, 500, error.message);
        }
    }

    async loginVerify(req, res) {
        try {
            const { email, otp, userType } = req.body;
            if (!userType || !['guide', 'consumer'].includes(userType)) {
                return failureResponse(res, 400, "Invalid userType. Must be 'guide' or 'consumer'.");
            }

            const result = await this.authService.loginVerify(email, otp, userType);


            return successResponse(res, 200, result.message, { token: result.token });
        } catch (error) {
            return failureResponse(res, 500, error.message);
        }
    }

}

module.exports = AuthController;
