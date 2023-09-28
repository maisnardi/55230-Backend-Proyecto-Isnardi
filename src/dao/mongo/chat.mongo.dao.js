//DAO Mongoose Chat
import ChatModel from "../../models/chat.schema.js"

class Chat{

    //DAO find all carts
    findAllChats = async()=>{
        return await ChatModel.find()
    }
    
    //DAO insert messages
    insertMessages = async (data)=>{
        await ChatModel.insertMany(data);
    }
}
export default Chat;