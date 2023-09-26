//Routes de los endpoints views de Carts

//Importaciones
import { Router } from "express";   //Router
import * as CartsViewController from "../controllers/cartsView.controller.js"


//Instaciamos 
const cartsViewRouter = Router();


//Endpoint GET req.params
cartsViewRouter.get('/:cid', CartsViewController.GETCartById)


export default cartsViewRouter;