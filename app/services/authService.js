const otpGenerator = require('otp-generator');
const JwtService = require("../services/jwtService");
const EmailService = require("../utils/emailService");
const AuthRepository = require("../repositories/authRepository");

class AuthService {
    constructor() {
        this.authRepository = new AuthRepository();
        this.emailService = new EmailService();
    }

    generateOTP() {
        return Math.floor(1000 + Math.random() * 9000).toString(); 
    }



    async sendOtpEmail(email, otp) {
        const subject = 'Your OTP Code';
        const text = `Hello,\n\nYour OTP code is: ${otp}\n\nThis code is valid for 10 minutes. Please do not share it with anyone.\n\nRegards,\nTeam`;
        await this.emailService.sendEmail(email, subject, text);
    }

    async signup(email, phone, userType) {
        const existingUser = await this.authRepository.findUserByEmail(email, userType);
        if (existingUser) {
            throw new Error("User already exists");
        }

        const otp = this.generateOTP();
        const otpExpirationTime = Date.now() + 10 * 60 * 1000;

        try {
            await this.sendOtpEmail(email, otp);
            await this.authRepository.createUser({ email, phone, otp, otpExpirationTime }, userType);
            return { message: 'Signup successful. OTP sent to your email.' };
        } catch (error) {
            throw new Error('Error during signup process');
        }
    }

    async verifyOtp(email, otp, userType) {
        console.log("thi is the otp ", otp)
        const user = await this.authRepository.findUserByEmail(email, userType);
        if (!user) {
            throw new Error('User not found');
        }

        if (user.otp !== otp) {
            throw new Error('Invalid OTP');
        }
        if (Date.now() > user.otpExpirationTime) {
            throw new Error('OTP has expired');
        }

        const payload = { userId: user.user_id, email: user.email };
        const token = JwtService.generateToken(payload);

        user.token = token;
        await this.authRepository.updateUser(user, userType);

        return { message: 'OTP verified successfully.', token };
    }

    async loginRequest(email, userType) {
        const user = await this.authRepository.findUserByEmail(email, userType);
        if (!user) {
            throw new Error('User not found');
        }

        const otp = this.generateOTP();
        user.otp = otp;
        await this.authRepository.updateUser(user, userType);
        await this.sendOtpEmail(email, otp);

        const payload = { userId: user.user_id, email: user.email };
        const token = JwtService.generateToken(payload);

        user.token = token;
        await this.authRepository.updateUser(user, userType);

        return { message: 'OTP sent to your email.', token };
    }


    async loginVerify(email, otp, userType) {
        const user = await this.authRepository.findUserByEmail(email, userType);
        if (!user || user.otp !== otp) {
            throw new Error('Invalid email or OTP');
        }

        const payload = { userId: user.user_id, email: user.email };
        const token = JwtService.generateToken(payload);

        user.token = token;
        await this.authRepository.updateUser(user, userType);

        return { token, message: 'Login successful.' };
    }


    async getUserFromToken(token, userType) {
        try {
            const decoded = JwtService.verifyToken(token);
            if (!decoded) {
                throw new Error('Invalid token');
            }
            const user = await this.authRepository.findUserById(decoded.userId, userType);
            return user;
        } catch (error) {
            throw new Error('Error retrieving user from token');
        }
    }
}

module.exports = AuthService;
