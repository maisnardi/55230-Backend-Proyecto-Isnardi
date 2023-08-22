//Importaciones
import { ObjectId } from "mongodb";
import mongoose, { model } from "mongoose";    //mongoose

//Schema de usuarios
const userSchema = new mongoose.Schema({
    _id:{
        type:ObjectId
    },
    first_name:{
        type:String,
        required: true
    },
    last_name:{
        type:String,
        required: true
    },
    email:{
        type:String,
        required: true
    },
    age:{
        type:String,
        required: true
    },
    password:{
        type:String,
        required: true
    },
    salt:{
        type:String
    },
    role:{
        type:String,
        enum:["admin","user"],
        default: "user"
    }
})

//Model de Usuarios
const UserModel = mongoose.model('users',userSchema);

export default UserModel;