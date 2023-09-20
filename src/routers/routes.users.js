//Routes de los Endpoints de Users

//Importaciones
import { Router } from "express";   //Router
import * as UserController from "../controllers/users.controller.js"

//Instaciamos 
const userRouter = Router();

//Endpoints para express
//Endpoint GET Users
userRouter.get('/', UserController.GETAllUsers)

//Endpoint POST User 
userRouter.post('/', UserController.POSTUser)

export default userRouter;