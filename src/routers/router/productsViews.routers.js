//Routes de los endpoints de Productos Views http://localhost:8080/

//Importaciones
import CustomRouter from "../custom.router.js";
import * as ProductsViewController from "../../controllers/productsView.controller.js"
import passportMW from "../../utils/passport.middleware.js";
import { protectByRole } from "../../utils/secure.middleware.js";
import {protectView} from "../../utils/secure.middleware.js"
//Extendemos la clase ProductsViewRouter de nuestro Customrouter
export default class ProductsViewRouter extends CustomRouter {
    init() {
        //Endpoints para express
        //Endpoint GET para mostrar productos en la view home http://localhost:8080/home
        this.read("/home", protectView, protectByRole(["admin", "premium"]), ProductsViewController.GETProductsInHomeView);

        //Endpoint GET para visualizar todos los prodcutos en tiempo real en la vista http://localhost:8080/realtimeproducts
        this.read("/realtimeproducts", protectView, protectByRole(["admin"]), ProductsViewController.GETRealTimeProducts);

        //Endpoint GET con la vista http://localhost:8080/products
        this.read("/products", protectView, ProductsViewController.GETAllProductsView);

        //Endpoint GET con la vista http://localhost:8080/product/:cid
        this.read("/product/:pid", protectView, ProductsViewController.GETProductByIdView);

        //Endpoint GET con la vista http://localhost:8080/product/modify/pid
        this.read("/product/modify/:pid", protectView, protectByRole(["admin", "premium"]), ProductsViewController.GETProductByIdViewHome);
    }
}

//nota antes el primer validation era passportMW("current") se reemplaza por protecView