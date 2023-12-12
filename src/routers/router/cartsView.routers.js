//Routes de los endpoints de Carts Views http://localhost:8080/carts

//Importaciones
import CustomRouter from "../custom.router.js";
import * as CartsViewController from "../../controllers/cartsView.controller.js"
import passportMW from "../../utils/passport.middleware.js";
import { isLogged, protectByRole } from "../../utils/secure.middleware.js";
import { navbarView } from "../../utils/viewsMiddleware.js";
//Extendemos la clase CartsViewsRouter de nuestro Customrouter
export default class CartsViewsRouter extends CustomRouter {
    init() {
        //Endpoints para express        
        //Endpoint GET req.params. http://localhost:8080/carts
        this.read('/',passportMW("current"),navbarView, CartsViewController.GETCartById)
    }
}