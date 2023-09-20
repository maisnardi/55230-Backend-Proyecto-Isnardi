//DAO Mongoose Chat
import ChatModel from "../../models/chat.schema.js"

//DAO find all carts
export const findAllChats = async()=>{
    return await ChatModel.find()
}

//DAO insert messages
export const insertMessages = async (data)=>{
    await ChatModel.insertMany(data);
}