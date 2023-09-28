import __dirname from "../dirname.js";
// import ChatModel from "../../models/chat.schema.js"
//import Chat from "../dao/mongo/chat.mongo.dao.js"

import { ChatsDAO } from "../dao/factory.js";

//Instaciamos la clase Chat
const ChatDAO = new ChatsDAO();

class ChatManager{

    //Función asíncrona que devuelve por consola todos los mensajes del chat cargados en el Array chats en ATLAS.
    getMessages = async ()=>{
        try {
            //const messages = await ChatModel.find();
            const messages = await ChatDAO.findAllChats();
            return messages;
        } catch (error) {
            console.log(error)
        }  
    }
    //Función asíncrona que agregar todos los mensajes del chat a ATLAS.
    addMessages = async (data)=>{
        try {
            //await ChatModel.insertMany(data);
            await ChatDAO.insertMessages(data);
        } catch (error) {
            console.log(error)
        }
    }
}

export default ChatManager;