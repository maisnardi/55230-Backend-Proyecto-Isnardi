//DAO Mongoose Users
import UserModel from "../../models/user.schema.js";

//DAO find
export const findAllUsers = async ()=>{
    return await UserModel.find().lean();
}

//DAO find by ID
export const findById = async (id)=>{ 
    return await UserModel.findById(id);
}

//DAO findByMail
export const findByEmail = async (email)=>{
    return await UserModel.findOne({email:email}).lean();
}

//DAO insert
export const insertUser = async (data)=>{
    return await UserModel.insertMany(data)
}

