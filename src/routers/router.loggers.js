//Routes del endpoint del Logger

//Importaciones
import { Router } from "express";
import * as LoggsApiController from "../controllers/loggers.controller.js"

//Instaciamos 
const loggerRouter = Router();

//Endpoint de Mocking GET
loggerRouter.get('/loggers',LoggsApiController.GETLoggers);

export default loggerRouter;