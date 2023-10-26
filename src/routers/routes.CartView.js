//Routes de los endpoints views de Carts

//Importaciones
import { Router } from "express";   //Router
import * as CartsViewController from "../controllers/cartsView.controller.js"
import passportMW from "../utils/passport.middleware.js"
import {protectByRole} from "../utils/secure.middleware.js"

//Instaciamos 
const cartsViewRouter = Router();


//Endpoint GET req.params
cartsViewRouter.get('/:cid', CartsViewController.GETCartById)

//Endpoint POST con req.params - Agrega un producto a un carrito.
cartsViewRouter.post("/:cid/product/:pid",passportMW("current"),protectByRole(["user"]), CartsViewController.POSTAddProductToCartId)

//Endpoint 
cartsViewRouter.post("/:cid/purchase", CartsViewController.POSTPurchaseCart)
export default cartsViewRouter;