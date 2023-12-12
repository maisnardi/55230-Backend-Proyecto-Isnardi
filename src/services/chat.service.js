import __dirname from "../dirname.js";
// import ChatModel from "../../models/chat.schema.js"
//import Chat from "../dao/mongo/chat.mongo.dao.js"

import { ChatsDAO } from "../dao/factory.js";
import CustomError from "../utils/Errors/CustomError.js";
import errorsDictionary from "../utils/Errors/EnumErrors.js";
//Instaciamos la clase Chat
const ChatDAO = new ChatsDAO();

class ChatManager {

    //Función asíncrona que devuelve por consola todos los mensajes del chat cargados en el Array chats en ATLAS.
    getMessages = async (next) => {
        try {
            //const messages = await ChatModel.find();
            const messages = await ChatDAO.findAllChats(next);
            if (messages) {
                if (messages.length > 0) {
                    return messages;
                }
                else {
                    return CustomError.new(errorsDictionary.notFoundChats);
                }
            } else {
                return CustomError.new(errorsDictionary.notFoundChats);
            }
        } catch (error) {
            error.from = "service";
            return next(error);
        }
    }
    //Función asíncrona que agregar todos los mensajes del chat a ATLAS.
    addMessages = async (data, next) => {
        try {
            //await ChatModel.insertMany(data);
            await ChatDAO.insertMessages(data, next);
        } catch (error) {
            error.from = "service";
            return next(error);
        }
    }
}

export default ChatManager;