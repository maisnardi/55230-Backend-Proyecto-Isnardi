//Routes de los endpoints de Productos http://localhost:8080/api/products

//Importaciones
import CustomRouter from "../custom.router.js";
import * as ProductsApiController from "../../controllers/products.controller.js"
import { protectByRoleApi } from "../../utils/secure.middleware.js";
import { JWTCookiesMW } from "../../utils/jwt.js"
import passportMW from "../../utils/passport.middleware.js"

//Extendemos la clase ProductsRouter de nuestro Customrouter
export default class ProductsRouter extends CustomRouter {
    init() {
        //Endpoints para express
        //Endpoint POST con req.body http://localhost:8080/api/products
        this.create("/",passportMW('current'), protectByRoleApi(["admin", "premium"]), ProductsApiController.MDWMulter, ProductsApiController.POSTProduct)

        //Endpoint GET con req.query http://localhost:8080/api/products
        this.read('/', JWTCookiesMW, ProductsApiController.GETProductsFilter);

        //Endpoint GET con req.params http://localhost:8080/api/products/:pid
        this.read('/:pid', JWTCookiesMW, ProductsApiController.GETProductById);

        //Endpoint PUT con req.params http://localhost:8080/api/products/:pid
        this.update('/:pid', passportMW('current'), protectByRoleApi(["admin", "premium"]), ProductsApiController.MDWMulter, ProductsApiController.PUTUpdateProductsById)

        //Endpoint DELETE con req.params http://localhost:8080/api/products/:pid
        this.destroy('/:pid', passportMW('current'), protectByRoleApi(["admin", "premium"]), ProductsApiController.DELETEProductById)
    }
}