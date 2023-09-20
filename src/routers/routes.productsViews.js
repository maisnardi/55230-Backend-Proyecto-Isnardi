//Routes de los endpoints de views de handlebars

//Importaciones
import { Router } from "express";   //Router
import * as ProductsViewController from "../controllers/productsView.controller.js"
import { protectView } from "../utils/secure.middleware.js";      //Protecciones


//Instaciamos 
const productsViewsRouter = Router();

//Endpoint GET para mostrar productos en la view home de handlebars 
productsViewsRouter.get("/home", ProductsViewController.GETProductsInHomeView);
 
//Endpoint POST con req.body para agregar productos desde el form de http://localhost:8080/
productsViewsRouter.post("/", ProductsViewController.MDWMulter, ProductsViewController.POSTProductsLive);

//Endpoint GET para visualizar todos los prodcutos en tiempo real en la vista http://localhost:8080/realtimeproducts
productsViewsRouter.get("/realtimeproducts", ProductsViewController.GETRealTimeProducts);

//Endpoint GET con la vista http://localhost:8080/products  
productsViewsRouter.get("/products", protectView, ProductsViewController.GETAllProductsView);

//Endpoint GET con la vista http://localhost:8080/product/:cid  
productsViewsRouter.get("/product/:cid", protectView, ProductsViewController.GETProductByIdView);

export default productsViewsRouter;