//Importaciones
import { ObjectId } from "mongodb";
import mongoose, { model } from "mongoose";    //mongoose

//Schema de product
const chatSchema = new mongoose.Schema({
    _id:{
        type:ObjectId
    },
    user:{
        type:String
    },
    message:{
        type:String
    }
})

//Model del chat
const ChatModel = mongoose.model('messages',chatSchema);

export default ChatModel;