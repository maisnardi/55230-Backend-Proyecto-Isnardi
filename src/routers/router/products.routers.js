//Routes de los endpoints de Productos http://localhost:8080/api/products

//Importaciones
import CustomRouter from "../custom.router.js";
import * as ProductsApiController from "../../controllers/products.controller.js"
import { protectByRoleApi } from "../../utils/secure.middleware.js";
import passportMW from "../../utils/passport.middleware.js"

//Extendemos la clase ProductsRouter de nuestro Customrouter
export default class ProductsRouter extends CustomRouter {
    init() {
        //Endpoints para express
        //Endpoint POST con req.body para crear productos. http://localhost:8080/api/products  -- SOLICITADO
        this.create("/", passportMW('current'), protectByRoleApi(["admin", "premium"]), ProductsApiController.MDWMulter, ProductsApiController.POSTProduct);

        //Endpoint GET con req.query para ver todos los productos. http://localhost:8080/api/products  -- SOLICITADO
        this.read('/', ProductsApiController.GETProductsFilter);        

        //Endpoint GET con req.params http://localhost:8080/api/products/:pid - ReadOne -- SOLICITADO 
        this.read('/:pid', passportMW('current'), protectByRoleApi(["user", "admin", "premium"]), ProductsApiController.GETProductById);

        //Endpoint PUT con req.params para actualizar un producto. http://localhost:8080/api/products/:pid  -- SOLICITADO
        this.update('/:pid', passportMW('current'), protectByRoleApi(["admin", "premium"]), ProductsApiController.MDWMulter, ProductsApiController.PUTUpdateProductsById);

        //Endpoint DELETE con req.params para eleminar un producto. http://localhost:8080/api/products/:pid  -- SOLICITADO
        this.destroy('/:pid', passportMW('current'), protectByRoleApi(["admin", "premium"]), ProductsApiController.DELETEProductById);
    }
}