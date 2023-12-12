//Routes de los endpoints de Carts http://localhost:8080/api/carts

//Importaciones
import CustomRouter from "../custom.router.js";
import * as CartApiController from "../../controllers/carts.controllers.js"
import passportMW from "../../utils/passport.middleware.js";
import { protectByRoleApi } from "../../utils/secure.middleware.js";

//Extendemos la clase CartsRouter de nuestro Customrouter
export default class CartsRouter extends CustomRouter {
    init() {
        //Endpoints para express
        //Endpoint POST - Crea un nuevo carrito http://localhost:8080/api/carts  -- SOLICITADO
        this.create("/", passportMW("current"), protectByRoleApi(["user", "premium"]), CartApiController.POSTCreateNewCart);

        //Endpoint POST con req.params - Agrega un producto a un carrito. http://localhost:8080/api/carts/:cid/product/:pid
        this.create("/:cid/product/:pid", passportMW("current"), protectByRoleApi(["user", "premium"]), CartApiController.POSTAddProductToCartId);

        //Endpoint GET req.params - Devuelve el carrito del ID recibido. http://localhost:8080/api/carts/:cid - ReadOne -- SOLICITADO
        this.read('/:cid', passportMW("current"), protectByRoleApi(["user", "premium"]),CartApiController.GETCartById);

        //Endpoint GET - Devuelve todos los productos del carrito del usuario logueado paginados. http://localhost:8080/api/carts  -- SOLICITADO
        this.read("/", passportMW("current"), protectByRoleApi(["user", "premium"]), CartApiController.GETCart)

        //Endpoint PUT con req.params y req.body - Actualiza un producto del carrito. http://localhost:8080/api/carts/:pid --  SOLICITADO
        this.update('/:pid', passportMW("current"), protectByRoleApi(["user", "premium"]), CartApiController.PUTUpdateProductById)

        //Endpoint PUT con req.params y req.body - Reemplazar por completo un array de productos. http://localhost:8080/api/carts/:cid
        this.update("/:cid", CartApiController.PUTUpadateFullCartbyId)

        //Endpoint PUT con req.params - Aumenta el valor de quantity de un producto de un carrito. http://localhost:8080/api/:cid/products/:pid
        this.update("/:cid/products/:pid", CartApiController.PUTIncrementQuantityById)

        //Endpoint DELETE con req.params - Elimina del carrito un producto seleccionado. http://localhost:8080/api/:cid/product/:pid
        this.destroy("/:cid/product/:pid", CartApiController.DELETEProductById)

        //Endpoint DELETE con req.params - Elimina del carrito del usuario logueado un producto seleccionado. http://localhost:8080/api/carts/:pid -- SOLICITADO
        this.destroy("/:pid", passportMW("current"), protectByRoleApi(["user", "premium"]), CartApiController.DELETEUsersProductById)

        //Endpoint DELETE - Eleminina todos los productos del carrito del usuario loggeado. http://localhost:8080/api/carts/
        this.destroy("/",passportMW("current"), protectByRoleApi(["user", "premium"]), CartApiController.DELETEDeleteProductsById)
    }
}