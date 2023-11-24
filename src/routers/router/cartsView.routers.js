//Routes de los endpoints de Carts Views http://localhost:8080/carts

//Importaciones
import CustomRouter from "../custom.router.js";
import * as CartsViewController from "../../controllers/cartsView.controller.js"
import passportMW from "../../utils/passport.middleware.js";
import { protectByRole } from "../../utils/secure.middleware.js";

//Extendemos la clase CartsViewsRouter de nuestro Customrouter
export default class CartsViewsRouter extends CustomRouter {
    init() {
        //Endpoints para express        
        //Endpoint POST para la compra del carrito
        this.create("/:cid/purchase", CartsViewController.POSTPurchaseCart)

        //Endpoint GET req.params. http://localhost:8080/carts/:cid
        this.read('/:cid', CartsViewController.GETCartById)
    }
}