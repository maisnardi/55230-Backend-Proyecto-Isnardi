//Routes de los endpoints de Productos http://localhost:8080/api/products

//Importaciones
import CustomRouter from "../custom.router.js";
import * as ProductsApiController from "../../controllers/products.controller.js"
import { protectByRoleApi } from "../../utils/secure.middleware.js";
import { JWTCookiesMW } from "../../utils/jwt.js"

//Extendemos la clase ProductsRouter de nuestro Customrouter
export default class ProductsRouter extends CustomRouter {
    init() {
        //Endpoints para express
        //Endpoint POST con req.body
        this.create("/", JWTCookiesMW, protectByRoleApi(["admin", "premium"]), ProductsApiController.MDWMulter, ProductsApiController.POSTProduct)

        //Endpoint GET con req.query
        this.read('/', JWTCookiesMW, ProductsApiController.GETProductsFilter);

        //Endpoint GET con req.params
        this.read('/:pid', JWTCookiesMW, ProductsApiController.GETProductById);

        //Endpoint PUT con req.params
        this.update('/:pid', JWTCookiesMW, ProductsApiController.MDWMulter, ProductsApiController.PUTUpdateProductsById)

        //Endpoint DELETE con req.params
        this.destroy('/:pid', JWTCookiesMW, protectByRoleApi(["admin", "premium"]), ProductsApiController.DELETEProductById)
    }
}