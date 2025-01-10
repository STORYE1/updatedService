const { where } = require("sequelize");
const { User, Consumer } = require("../models");

class AuthRepository {
    /**
     * Dynamically fetches the correct model based on userType.
     */
    getModel(userType) {
        if (userType === "guide") {
            return User;
        } else if (userType === "consumer") {
            return Consumer;
        } else {
            throw new Error("Invalid userType");
        }
    }

    async findUserByEmail(email, userType) {
        const Model = this.getModel(userType);
        return await Model.findOne({ where: { email } });
    }

    async createUser(userData, userType) {
        console.log("i am here in repo")

        const Model = this.getModel(userType);
        return await Model.create(userData);
    }

    async updateUser(userData, userType) {
        try {
            const Model = this.getModel(userType);
            const user = await Model.findOne({ where: { email: userData.email } });

            if (user) {
                if (!userData.otp) {
                    throw new Error("OTP cannot be null");
                }

                user.otp = userData.otp;
                user.token = userData.token;
                user.is_verified = userData.is_verified;

                return await user.save();
            } else {
                throw new Error("User not found");
            }
        } catch (error) {
            console.error("Error updating user: ", error.message);
            throw error;
        }
    }

    async findUserById(userId, userType) {
        const Model = this.getModel(userType);
        return await Model.findByPk(userId);
    }
}

module.exports = AuthRepository;
