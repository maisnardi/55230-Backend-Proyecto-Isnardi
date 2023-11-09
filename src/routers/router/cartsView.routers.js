//Routes de los endpoints de Carts Views

//Importaciones
import CustomRouter from "../custom.router.js";
import * as CartsViewController from "../../controllers/cartsView.controller.js"
import passportMW from "../../utils/passport.middleware.js";
import { protectByRole } from "../../utils/secure.middleware.js";

//Extendemos la clase CartsViewsRouter de nuestro Customrouter
export default class CartsViewsRouter extends CustomRouter {
    init() {
        //Endpoints para express
        //Endpoint POST con req.params - Agrega un producto a un carrito.
        this.create("/:cid/product/:pid",passportMW("current"),protectByRole(["user"]), CartsViewController.POSTAddProductToCartId)
        
        //Endpoint POST para la compra del carrito
        this.create("/:cid/purchase", CartsViewController.POSTPurchaseCart)

        //Endpoint GET req.params
        this.read('/:cid', CartsViewController.GETCartById)
    }
}