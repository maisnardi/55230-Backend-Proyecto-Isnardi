//Routes del endpoint de Chat

//Importaciones
import { Router } from "express";
import ChatManager from "../dao/mongo/mongoChatManager.js"

//Instanciamos un nuevo productManager.
const chatManager = new ChatManager();
//Instaciamos
const chatRouter = Router();

//Endpoint GET
chatRouter.get("/", async(req, res)=>{
    try {
        const messages = await chatManager.getMessages();
        req.io.on('connection', socket=>{
            req.io.emit("chat", messages)
        })
        console.log("se enviaron los mensajes")
        res.render("chat"); 
    } catch (error) {
        console.log(error)
    }
})

export default chatRouter;