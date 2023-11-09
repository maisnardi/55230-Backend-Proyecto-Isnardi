//Routes de los endpoints de views de handlebars

//Importaciones
import { Router } from "express";   //Router
import * as ProductsViewController from "../controllers/productsView.controller.js"
import { protectView } from "../utils/secure.middleware.js";      //Protecciones
import passportMW from "../utils/passport.middleware.js";
import {protectByRole} from "../utils/secure.middleware.js" 

//Instaciamos 
const productsViewsRouter = Router();

//Endpoint GET para mostrar productos en la view home de handlebars 
productsViewsRouter.get("/home",passportMW("current"), protectByRole(["admin", "premium"]), ProductsViewController.GETProductsInHomeView);

//Endpoint POST con req.body para agregar productos desde el form de http://localhost:8080/home
productsViewsRouter.post("/", passportMW("current"), protectByRole(["admin","premium"]), ProductsViewController.MDWMulter, ProductsViewController.POSTProductsLive);

//Endpoint GET para visualizar todos los prodcutos en tiempo real en la vista http://localhost:8080/realtimeproducts
productsViewsRouter.get("/realtimeproducts",passportMW("current"), protectByRole(["admin"]), ProductsViewController.GETRealTimeProducts);

//Endpoint GET con la vista http://localhost:8080/products  
productsViewsRouter.get("/products", passportMW("current"),ProductsViewController.GETAllProductsView);

//Endpoint GET con la vista http://localhost:8080/product/:cid  
productsViewsRouter.get("/product/:pid", passportMW("current"), ProductsViewController.GETProductByIdView);

//Endpoint GET con la vista http://localhost:8080/product/modify/pid
productsViewsRouter.get("/product/modify/:pid",passportMW("current"), protectByRole(["admin","premium"]), ProductsViewController.GETProductByIdViewHome)  
export default productsViewsRouter;