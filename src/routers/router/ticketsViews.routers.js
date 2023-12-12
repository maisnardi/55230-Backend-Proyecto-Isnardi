//Routes de los endpoints de tickets Views http://localhost:8080/tickets

//Importaciones
import CustomRouter from "../custom.router.js";
import passport from "passport";
import * as TicketsViewsController from "../../controllers/ticketsViews.controller.js"
import { isLogged, protectView } from "../../utils/secure.middleware.js";
import passportMW from "../../utils/passport.middleware.js";
import {navbarView} from "../../utils/viewsMiddleware.js";

//Extendemos la clase TicketViewRouter de nuestro Customrouter
export default class TicketViewRouter extends CustomRouter {
    init() {
        //Endpoints para express
        //Endoint GET para mostrar la vista de la pagina premium. http://localhost:8080/tickets/:tid
        this.read('/:tid',protectView, navbarView, TicketsViewsController.GETTicketById)
    }
}