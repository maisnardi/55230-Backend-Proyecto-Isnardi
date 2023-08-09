import __dirname from "../../dirname.js";
import ChatModel from "../../models/chat.schema.js"

class ChatManager{

    //Función asíncrona que devuelve por consola todos los mensajes del chat cargados en el Array chats en ATLAS.
    getMessages = async ()=>{
        try {
            const messages = await ChatModel.find();
            return messages;
        } catch (error) {
            console.log(error)
        }  
    }
    //Función asíncrona que agregar todos los mensajes del chat a ATLAS.
    addMessages = async (data)=>{
        try {
            await ChatModel.insertMany(data);
        } catch (error) {
            console.log(error)
        }
    }
}

export default ChatManager;