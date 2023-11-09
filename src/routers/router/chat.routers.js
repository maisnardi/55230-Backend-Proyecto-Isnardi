//Routes de los endpoints de Chat

//Importaciones
import CustomRouter from "../custom.router.js";
import * as LiveChatViewController from "../../controllers/chatView.controller.js"
import passportMW from "../../utils/passport.middleware.js";
import { protectByRole } from "../../utils/secure.middleware.js"

//Extendemos la clase ChatRouter de nuestro Customrouter
export default class ChatRouter extends CustomRouter {
    init() {
        //Endpoints para express

        //Endpoint GET de la vista chat
        this.read("/", passportMW("current"), protectByRole(["user", "premium"]), LiveChatViewController.GETLiveChatView);
    }
}