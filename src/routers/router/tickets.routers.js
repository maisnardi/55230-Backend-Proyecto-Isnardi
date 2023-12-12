//Routes de los endpoints de Ticket views de handlebars http://localhost:8080/api/tickets

//Importaciones
import CustomRouter from "../custom.router.js";
import * as TicketApiController from "../../controllers/tickets.controller.js"
import { protectByRoleApi } from "../../utils/secure.middleware.js";
import { JWTCookiesMW } from "../../utils/jwt.js"
import passportMW from "../../utils/passport.middleware.js"


//Extendemos la clase ProductsRouter de nuestro Customrouter
export default class ProductsRouter extends CustomRouter {
    init() {
        //Endpoints para express
        //Endpoint POST para crear un nuevo ticket. http://localhost:8080/api/tickets -- SOLICITADO
        this.create('/', passportMW("current"), protectByRoleApi(["user", "premium"]), TicketApiController.POSTCreateTicket)

        //Endpoint GET para calcular el total a pagar. http://localhost:8080/api/tickets -- SOLICITADO
        this.read('/', passportMW("current"), protectByRoleApi(["user", "premium"]), TicketApiController.GETCalculateAmount);
    }
}