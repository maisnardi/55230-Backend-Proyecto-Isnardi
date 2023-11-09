//Routes de los endpoints de Users Views

//Importaciones
import CustomRouter from "../custom.router.js";
import passport from "passport";
import * as UserViewsController from "../../controllers/usersViews.controller.js"
import { isLogged, protectView } from "../../utils/secure.middleware.js";
import passportMW from "../../utils/passport.middleware.js";

//Extendemos la clase UsersViewsRouter de nuestro Customrouter
export default class UsersViewsRouter extends CustomRouter {
    init() {
        //Endpoints para express
        //Endpoint POST para enviar los datos ingresado en la vista de Login. Con Passport.
        this.create("/login", passport.authenticate("login", { successRedirect: "/products", failureRedirect: "/" }), UserViewsController.POSTNone)

        //Endoint POST de register para enviar los datos ingresado en la vista de registro.Con Passport.
        this.create('/register', passport.authenticate("register", { successRedirect: "/", failureRedirect: "/register" }), UserViewsController.POSTNone)

        //Endpoint POST para enviar correo de restablecimiento de password
        this.create('/restore', UserViewsController.POSTRestorePassword)

        //Endoint PUT para cambiar la clave del usuario.
        this.create('/restore/:userID', UserViewsController.POSTUserResetPassword)

        //Endpoint GET para mostrar la vista de Login.
        this.read('/', isLogged, UserViewsController.GETLoginView)

        //Endoint GET de register para mostrar la vista del formulario de registro.
        this.read('/register', isLogged, UserViewsController.GETRegisterView)

        //Endoint GET de profile para mostrar la vista del perfil del usuario.
        this.read('/profile', passportMW("current"), UserViewsController.GETProfileView)

        //Endoint GET para cerrar la sesion del usuario.
        this.read('/logout', protectView, UserViewsController.GETLogoutView)

        //Endoint GET para ver los datos de la session.
        //this.read('/sessions', UserViewsController.GETSessionView)

        //Endoint GET para restaurar la clave del usuario.
        this.read('/restore', UserViewsController.GETRestoreView)

        //Endoint GET para restaurar la clave del usuario.
        this.read('/restore/:userID', UserViewsController.GETUserResetPasswordView)
    }
}