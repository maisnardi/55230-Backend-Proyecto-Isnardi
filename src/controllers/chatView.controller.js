//Controller de Chat view
//Importaciones
import ChatManager from "../services/chat.service.js"

//Instanciamos un nuevo productManager.
const chatManager = new ChatManager();

//Controller GET Chat
export const GETLiveChatView = async (req, res, next) => {
    try {
        const messages = await chatManager.getMessages(next);
        req.io.on('connection', socket => {
            req.io.emit("chat", messages)
        })
        console.log("se enviaron los mensajes")
        res.render("chat");
    } catch (error) {
        error.from = "controller";
        return next(error);
    }
}