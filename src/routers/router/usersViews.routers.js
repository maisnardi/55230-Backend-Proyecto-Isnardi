//Routes de los endpoints de Users Views http://localhost:8080/

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
        //Endpoint GET para mostrar la vista de Login. http://localhost:8080/
        this.read('/', isLogged, UserViewsController.GETLoginView)

        //Endoint GET de register para mostrar la vista del formulario de registro. http://localhost:8080/register
        this.read('/register', isLogged, UserViewsController.GETRegisterView)

        //Endoint GET de profile para mostrar la vista del perfil del usuario. http://localhost:8080/profile
        this.read('/profile', passportMW("current"), UserViewsController.GETProfileView)

        //Endoint GET para cerrar la sesion del usuario. http://localhost:8080/logout
        this.read('/logout', protectView, UserViewsController.GETLogoutView)

        //Endoint GET para ver los datos de la session.
        //this.read('/sessions', UserViewsController.GETSessionView)

        //Endoint GET para restaurar la clave del usuario. http://localhost:8080/restore
        this.read('/restore', UserViewsController.GETRestoreView)

        //Endoint GET para restaurar la clave del usuario. http://localhost:8080/restore/:userID
        this.read('/restore/:userID', UserViewsController.GETUserResetPasswordView)
    }
}