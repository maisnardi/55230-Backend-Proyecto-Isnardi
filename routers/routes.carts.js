//Routes de los endpoints de Carts

//Importaciones
import { Router } from "express";   //Router
import * as CartApiController from "../controllers/carts.controllers.js"
import passportMW from "../utils/passport.middleware.js"
import {protectByRole} from "../utils/secure.middleware.js"

//Instaciamos 
const cartRouter = Router();

//Endpoint POST - Crea un nuevo carrito.
cartRouter.post("/", CartApiController.POSTCreateNewCart)

//Endpoint GET req.params - Devuelve el carrito del ID recibido.
cartRouter.get('/:cid', CartApiController.GETCartById)

//Endpoint POST con req.params - Agrega un producto a un carrito.
cartRouter.post("/:cid/product/:pid",passportMW("current"),protectByRole("user"),CartApiController.POSTAddProductToCartId)

//Endpoint DELETE con req.params - Elimina del carrito un producto seleccionado.
cartRouter.delete("/:cid/product/:pid", CartApiController.DELETEProductById)

//Endpoint PUT con req.params y req.body - Reemplazar por completo un array de productos.
cartRouter.put("/:cid", CartApiController.PUTUpadateFullCartbyId)

//Endpoint PUT con req.params - Aumenta el valor de quantity de un producto de un carrito.
cartRouter.put("/:cid/products/:pid", CartApiController.PUTIncrementQuantityById)  

//Endpoint DELETE con req.params - Eleminina todos los productos de un carrito.
cartRouter.delete("/:cid", CartApiController.DELETEDeleteProductsById)

//Endpoint 
cartRouter.post("/:cid/purchase",passportMW("current"), CartApiController.POSTPurchaseCart)
export default cartRouter;