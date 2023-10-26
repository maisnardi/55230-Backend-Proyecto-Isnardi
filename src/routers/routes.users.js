//Routes de los Endpoints de Users

//Importaciones
import { Router } from "express";   //Router
import * as UserController from "../controllers/users.controller.js"
import passport from "passport";
import {protectByRole} from "../utils/secure.middleware.js"

//Instaciamos 
const userRouter = Router();

//Endpoints para express
//Endpoint GET Users.
userRouter.get('/', UserController.GETAllUsers)

//Endpoint POST User.
userRouter.post('/', UserController.POSTUser)

//Endpoint POST User para login JWT.
userRouter.post('/login', UserController.POSTUserLogin)

//Endpoint GET User para profile.
//userRouter.get('/current', passport.authenticate ('current', {session:false}),protectByRole(["user"]),UserController.GETUser);
userRouter.get('/current', UserController.GETCurrentUser)

//Endpoint PUT para actualizar el rol del usuario.
userRouter.put('/users/premium/:uid', UserController.PUTUserRole)

export default userRouter;