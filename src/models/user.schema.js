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
    },
    username:{
        type:String,
        default:" "
    },
    cartId:{
        type:mongoose.Schema.Types.ObjectId,
        ref: "carts"     
    }
})

//Model de Usuarios
const UserModel = mongoose.model('users',userSchema);

export default UserModel;