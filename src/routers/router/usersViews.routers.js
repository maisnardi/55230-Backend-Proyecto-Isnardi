//Routes de los endpoints de Users Views http://localhost:8080/

//Importaciones
import CustomRouter from "../custom.router.js";
import passport from "passport";
import * as UserViewsController from "../../controllers/usersViews.controller.js"
import { isLogged, protectView } from "../../utils/secure.middleware.js";
import passportMW from "../../utils/passport.middleware.js";
import { navbarView } from "../../utils/viewsMiddleware.js";

//Extendemos la clase UsersViewsRouter de nuestro Customrouter
export default class UsersViewsRouter extends CustomRouter {
    init() {
        //Endpoints para express
        //Endpoint GET para mostrar la vista de Login. http://localhost:8080/login
        this.read('/login', isLogged, UserViewsController.GETLoginView)

        //Endoint GET de register para mostrar la vista del formulario de registro. http://localhost:8080/register
        this.read('/register', isLogged, UserViewsController.GETRegisterView)

        //Endoint GET de profile para mostrar la vista del perfil del usuario. http://localhost:8080/profile
        this.read('/profile', protectView, passportMW("current"), navbarView, UserViewsController.GETProfileView)

        //Endoint GET para cerrar la sesion del usuario. http://localhost:8080/logout
        this.read('/logout', protectView, UserViewsController.GETLogoutView)

        //Endoint GET para restaurar la clave del usuario no logueado. http://localhost:8080/restore
        this.read('/restore', isLogged, UserViewsController.GETRestoreView)

        //Endpoint GET para cambiar la clave de un usuario ya logeado. http://localhost:8080/password
        this.read('/password', protectView, navbarView, UserViewsController.GETChangePasswordView)

        //Endoint GET para restaurar la clave del usuario no logueado. http://localhost:8080/restore/:userID
        this.read('/restore/:userID',isLogged, UserViewsController.GETUserResetPasswordView)

        //Endoint GET para cambiar la clave de un usuario ya logeado.. http://localhost:8080/password/:userID
        this.read('/password/:userID', UserViewsController.GETLoggedUserResetPasswordView)

        //Endoint GET para mostrar la vista de la pagina premium. http://localhost:8080/premium
        this.read('/premium', protectView, navbarView, UserViewsController.GETPremiumView)
    }
}