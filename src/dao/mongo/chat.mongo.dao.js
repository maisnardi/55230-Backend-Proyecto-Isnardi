//DAO Mongoose Chat
import ChatModel from "../../models/chat.schema.js"
import CustomError from "../../utils/Errors/CustomError.js";
import errorsDictionary from "../../utils/Errors/EnumErrors.js";
class Chat{

    //DAO find all carts
    findAllChats = async(next)=>{
        try {
            let chats = await ChatModel.find();
            if(chats)
            {
                if(chats.length>0) return chats
                else{
                    return CustomError.new(errorsDictionary.notFoundChats);
                }
            }
            else{
                return CustomError.new(errorsDictionary.notFoundChats);
            }    
        } catch (error) {
            error.from = "mongo";
            return next(error);
        }
        
    }
    
    //DAO insert messages
    insertMessages = async (data, next)=>{
        try {
            let response = await ChatModel.insertMany(data);
            if(response.length>0){
                return {message: "loaded"}
            }
            else{
                return CustomError.new(errorsDictionary.messageNotDelivered);
            }
        } catch (error) {
            error.from = "mongo";
            return next(error);
        }
    }
}
export default Chat;