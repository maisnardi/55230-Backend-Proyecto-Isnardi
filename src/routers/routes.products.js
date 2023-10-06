//Routes de los endpoints de Productos

//Importaciones
import { Router } from "express";   //Router
import * as ProductsApiController from "../controllers/products.controller.js"

//Instaciamos 
const productRouter = Router();

//Endpoints para express
//Endpoint GET con req.query
productRouter.get('/', ProductsApiController.GETProductsFilter)

//Endpoint GET con req.params
productRouter.get('/:pid', ProductsApiController.GETProductById)

//Endpoint POST con req.body
productRouter.post("/", ProductsApiController.MDWMulter,ProductsApiController.POSTProduct)

//Endpoint PUT
productRouter.put('/:pid', ProductsApiController.MDWMulter,ProductsApiController.PUTUpdateProductsById)

//Endpoint DELETE
productRouter.delete('/:pid',ProductsApiController.DELETEProductById)

export default productRouter;