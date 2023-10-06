//Routes del endpoint de mocks - Se crean dumy products para pruebas.

//Importaciones
import { Router } from "express";
import * as MocksApiController from "../controllers/mocks.controller.js"

//Instaciamos 
const mockRouter = Router();

//Endpoint de Mocking GET
mockRouter.get('/mockingproducts',MocksApiController.GETMockingProducts);




export default mockRouter;