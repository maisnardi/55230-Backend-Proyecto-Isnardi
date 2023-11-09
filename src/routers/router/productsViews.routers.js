//Routes de los endpoints de Productos Views http://localhost:8080/

//Importaciones
import CustomRouter from "../custom.router.js";
import * as ProductsViewController from "../../controllers/productsView.controller.js"
import passportMW from "../../utils/passport.middleware.js";
import { protectByRole } from "../../utils/secure.middleware.js";

//Extendemos la clase ProductsViewRouter de nuestro Customrouter
export default class ProductsViewRouter extends CustomRouter {
    init() {
        //Endpoints para express
        //Endpoint POST con req.body para agregar productos desde el form de http://localhost:8080/home
        this.create("/", passportMW("current"), protectByRole(["admin", "premium"]), ProductsViewController.MDWMulter, ProductsViewController.POSTProductsLive);

        //Endpoint GET para mostrar productos en la view home de handlebars 
        this.read("/home", passportMW("current"), protectByRole(["admin", "premium"]), ProductsViewController.GETProductsInHomeView);

        //Endpoint GET para visualizar todos los prodcutos en tiempo real en la vista http://localhost:8080/realtimeproducts
        this.read("/realtimeproducts", passportMW("current"), protectByRole(["admin"]), ProductsViewController.GETRealTimeProducts);

        //Endpoint GET con la vista http://localhost:8080/products
        this.read("/products", passportMW("current"), ProductsViewController.GETAllProductsView);

        //Endpoint GET con la vista http://localhost:8080/product/:cid
        this.read("/product/:pid", passportMW("current"), ProductsViewController.GETProductByIdView);

        //Endpoint GET con la vista http://localhost:8080/product/modify/pid
        this.read("/product/modify/:pid", passportMW("current"), protectByRole(["admin", "premium"]), ProductsViewController.GETProductByIdViewHome);
    }
}