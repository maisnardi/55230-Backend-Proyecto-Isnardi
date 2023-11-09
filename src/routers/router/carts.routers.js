//Routes de los endpoints de Carts

//Importaciones
import CustomRouter from "../custom.router.js";
import * as CartApiController from "../../controllers/carts.controllers.js"
import passportMW from "../../utils/passport.middleware.js";
import { protectByRole} from "../../utils/secure.middleware.js";

//Extendemos la clase CartsRouter de nuestro Customrouter
export default class CartsRouter extends CustomRouter {
    init() {
        //Endpoints para express
        //Endpoint POST - Crea un nuevo carrito.
        this.create("/",CartApiController.POSTCreateNewCart);

        //Endpoint POST con req.params - Agrega un producto a un carrito.
        this.create("/:cid/product/:pid",passportMW("current"),protectByRole(["user"]),CartApiController.POSTAddProductToCartId);

        //Endpoint POST para realizar la compra
        this.create("/:cid/purchase",passportMW("current"), CartApiController.POSTPurchaseCart)

        //Endpoint GET req.params - Devuelve el carrito del ID recibido.
        this.read('/:cid', CartApiController.GETCartById);

        //Endpoint PUT con req.params y req.body - Reemplazar por completo un array de productos.
        this.update("/:cid", CartApiController.PUTUpadateFullCartbyId)

        //Endpoint PUT con req.params - Aumenta el valor de quantity de un producto de un carrito.
        this.update("/:cid/products/:pid", CartApiController.PUTIncrementQuantityById) 
        
        //Endpoint DELETE con req.params - Elimina del carrito un producto seleccionado.
        this.destroy("/:cid/product/:pid", CartApiController.DELETEProductById)

        //Endpoint DELETE con req.params - Eleminina todos los productos de un carrito.
        this.destroy("/:cid", CartApiController.DELETEDeleteProductsById)
    }
}