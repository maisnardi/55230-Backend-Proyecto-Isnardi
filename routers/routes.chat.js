//Routes del endpoint de Chat

//Importaciones
import { Router } from "express";
import * as LiveChatViewController from "../controllers/chatView.controller.js"
import passportMW from "../utils/passport.middleware.js";
import {protectByRole} from "../utils/secure.middleware.js"
//Instaciamos
const chatRouter = Router();

//Endpoint GET de la vista chat
chatRouter.get("/", passportMW("current"), protectByRole("user") ,LiveChatViewController.GETLiveChatView);

export default chatRouter;