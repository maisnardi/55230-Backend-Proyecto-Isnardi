//DAO Mongoose Users
import UserModel from "../../models/user.schema.js";

class User{
    //DAO find
    findAllUsers = async ()=>{
        return await UserModel.find().lean();
    }
    
    //DAO find by ID
    findById = async (id)=>{ 
        return await UserModel.findById(id);
    }
    
    //DAO findByMail
    findByEmail = async (email)=>{
        return await UserModel.findOne({email:email}).lean();
    }
    
    //DAO insert
    insertUser = async (data)=>{
        return await UserModel.insertMany(data)
    }
}

export default User;