//Routes de los endpoints de las vistas de users

//Importaciones
import { Router } from "express";   //Router
import { isLogged, protectView } from "../utils/secure.middleware.js";
import passport from "passport";
import * as UserViewsController from "../controllers/usersViews.controller.js"
import passportMW from "../utils/passport.middleware.js"

//Instaciamos 
const userRouterViews = Router();

//Endpoints para express
//Endpoint GET para mostrar la vista de Login.
userRouterViews.get('/',isLogged,UserViewsController.GETLoginView)

//Endpoint POST para enviar los datos ingresado en la vista de Login. Con Passport.
userRouterViews.post("/login", passport.authenticate("login", {successRedirect:"/products",failureRedirect:"/"}), UserViewsController.POSTNone)

//Endoint GET de register para mostrar la vista del formulario de registro.
userRouterViews.get('/register', isLogged, UserViewsController.GETRegisterView)

//Endoint POST de register para enviar los datos ingresado en la vista de registro.Con Passport.
userRouterViews.post('/register', passport.authenticate("register", {successRedirect: "/", failureRedirect:"/register"}), UserViewsController.POSTNone)

//Endoint GET de profile para mostrar la vista del perfil del usuario.
userRouterViews.get('/profile', passportMW("current"), UserViewsController.GETProfileView)

//Endoint GET para cerrar la sesion del usuario.
userRouterViews.get('/logout', protectView, UserViewsController.GETLogoutView)

//Endoint GET para ver los datos de la session.
//userRouterViews.get('/sessions', UserViewsController.GETSessionView)

//Endoint GET para restaurar la clave del usuario.
userRouterViews.get('/restore',  UserViewsController.GETRestoreView)

//Endpoint POST para enviar correo de restablecimiento de password
userRouterViews.post('/restore', UserViewsController.POSTRestorePassword)

//Endoint GET para restaurar la clave del usuario.
userRouterViews.get('/restore/:userID',UserViewsController.GETUserResetPasswordView)

//Endoint PUT para cambiar la clave del usuario.
userRouterViews.post('/restore/:userID',UserViewsController.POSTUserResetPassword)


export default userRouterViews;