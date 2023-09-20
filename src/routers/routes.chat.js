//Routes del endpoint de Chat

//Importaciones
import { Router } from "express";
import * as LiveChatViewController from "../controllers/chatView.controller.js"
//Instaciamos
const chatRouter = Router();

//Endpoint GET de la vista chat
chatRouter.get("/", LiveChatViewController.GETLiveChatView);

export default chatRouter;