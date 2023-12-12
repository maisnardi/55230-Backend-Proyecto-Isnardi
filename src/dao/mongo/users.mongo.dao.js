//DAO Mongoose Users
import UserModel from "../../models/user.schema.js";

class User {
    //DAO find
    findAllUsers = async (next) => {
        try {
            return await UserModel.find().lean();
        } catch (error) {
            error.from = "mongo"
            return next(error);
        }
    }

    //DAO find by ID
    findById = async (id, next) => {
        try {
            return await UserModel.findById(id);
        } catch (error) {
            error.from = "mongo"
            return next(error);
        }
    }

    //DAO findByMail
    findByEmail = async (email, next) => {
        try {
            return await UserModel.findOne({ email: email }).lean();
        } catch (error) {
            error.from = "mongo"
            return next(error);
        }
    }

    //DAO insert
    insertUser = async (data, next) => {
        try {
            return await UserModel.insertMany(data)
        } catch (error) {
            error.from = "mongo"
            return next(error);
        }
    }
    //DAO update user
    updateUser = async (id, data, next) => {
        try {
            return await UserModel.findByIdAndUpdate(id, data);
        } catch (error) {
            error.from = "mongo"
            return next(error);
        }
    }
}

export default User;