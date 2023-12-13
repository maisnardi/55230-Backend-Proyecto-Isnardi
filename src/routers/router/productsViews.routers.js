//Routes de los endpoints de Productos Views http://localhost:8080/

//Importaciones
import CustomRouter from "../custom.router.js";
import * as ProductsViewController from "../../controllers/productsView.controller.js"
import passportMW from "../../utils/passport.middleware.js";
import { protectByRole } from "../../utils/secure.middleware.js";
import { protectView } from "../../utils/secure.middleware.js"
import { navbarView } from "../../utils/viewsMiddleware.js"
//Extendemos la clase ProductsViewRouter de nuestro Customrouter
export default class ProductsViewRouter extends CustomRouter {
    init() {
        //Endpoints para express
        //Endpoint GET para mostrar productos en la view New http://localhost:8080/new
        this.read("/new", protectView, navbarView, protectByRole(["admin", "premium"]), ProductsViewController.GETProductsInNewView);

        //Endpoint GET para visualizar todos los prodcutos en tiempo real en la vista http://localhost:8080/realtimeproducts
        //this.read("/realtimeproducts", protectView, protectByRole(["admin"]), ProductsViewController.GETRealTimeProducts);

        //Endpoint GET con la vista de todos los productos. http://localhost:8080/products
        this.read("/products", navbarView, ProductsViewController.GETAllProductsView);

        //Endpoint GET con la vista del detalle del producto. http://localhost:8080/product/:cid
        this.read("/product/:pid", navbarView, ProductsViewController.GETProductByIdView);

        //Endpoint GET con la vista http://localhost:8080/product/update/:pid
        this.read("/product/update/:pid", navbarView, protectView, protectByRole(["admin", "premium"]), ProductsViewController.GETProductByIdViewUpdate);

        //Endpoint GET con la vista http://localhost:8080/products/update
        this.read('/products/update', navbarView, protectByRole(["admin", "premium"]), ProductsViewController.GETProductByOwner);

        //Endoint GET para mostrar la vista de la pagina principal. http://localhost:8080/
        this.read('/', navbarView, ProductsViewController.GETIndex)
    }
}

