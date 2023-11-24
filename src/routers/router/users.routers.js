//Routes de los endpoints de Users http://localhost:8080/api/auth

//Importaciones
import CustomRouter from "../custom.router.js";
import * as UserController from "../../controllers/users.controller.js"
import { protectByRole, protectView } from "../../utils/secure.middleware.js";
import passport from "passport";


//Extendemos la clase UsersRouter de nuestro Customrouter
export default class UsersRouter extends CustomRouter {
    init() {
        //Endpoints para express
        //Endpoint POST User. http://localhost:8080/api/auth/
        this.create('/', UserController.POSTUser)

        //Endpoint POST User con passport. http://localhost:8080/api/auth/register
        this.create('/register', passport.authenticate("register"), UserController.POSTNone)

        //Endpoint POST User para login JWT. http://localhost:8080/api/auth/login
        this.create("/login", passport.authenticate("login"), UserController.POSTUserLogin)

        //Endpoint POST para enviar correo de restablecimiento de password http://localhost:8080/api/auth/restore
        this.create('/restore', UserController.POSTRestorePassword)

        //Endpoint POST para cambiar la password del usuario userID http://localhost:8080/api/auth/restore/:uid
        this.create('/restore/:userID', UserController.POSTUserResetPassword)

        //Endpoint GET Users. http://localhost:8080/api/auth/
        this.read('/', UserController.GETAllUsers)

        //Endpoint GET User para profile. http://localhost:8080/api/auth/profile
        //this.read('/current', passport.authenticate ('current', {session:false}),protectByRole(["user"]),UserController.GETUser);
        this.read('/current', UserController.GETCurrentUser)

        //Endpoint PUT para actualizar el rol del usuario. http://localhost:8080/api/auth/users/premium/:uid
        this.update('/users/premium/:uid', UserController.PUTUserRole)

        //Endpoint POST para cerrar sesion. http://localhost:8080/api/auth/signout
        this.create('/signout', UserController.POSTSignout)
    }
}