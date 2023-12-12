//Routes de los endpoints de Users http://localhost:8080/api/auth

//Importaciones
import CustomRouter from "../custom.router.js";
import * as UserController from "../../controllers/users.controller.js"
import { protectByRole, protectView } from "../../utils/secure.middleware.js";
import passport from "passport";
import passportMW from "../../utils/passport.middleware.js";
import * as AuthController from "../../controllers/auth.controller.js"

//Extendemos la clase UsersRouter de nuestro Customrouter
export default class UsersRouter extends CustomRouter {
    init() {
        //Endpoints para express
        //Endpoint POST User. http://localhost:8080/api/auth/
        this.create('/', UserController.POSTUser)

        //Endpoint POST User con passport. http://localhost:8080/api/auth/register -- SOLICITADO
        this.create('/register', passport.authenticate("register"), UserController.POSTNone)

        //Endpoint POST User para login JWT. http://localhost:8080/api/auth/login -- SOLICITADO
        this.create("/login", passport.authenticate("login"), UserController.POSTUserLogin)

        //Endpoint POST para enviar correo de restablecimiento de password http://localhost:8080/api/auth/restore
        this.create('/restore', UserController.POSTRestorePassword)

        //Endpoint POST para cambiar la password del usuario userID http://localhost:8080/api/auth/restore/:uid
        this.create('/restore/:userID', UserController.POSTUserResetPassword)

        //Endpoint POST para enviar correo de restablecimiento de password http://localhost:8080/api/auth/password
        this.create('/password', UserController.POSTChangeLoggedUserPassword)

        //Endpoint GET Users. http://localhost:8080/api/auth/
        this.read('/', UserController.GETAllUsers)

        //Endpoint GET User para profile. http://localhost:8080/api/auth/profile
        //this.read('/current', passport.authenticate ('current', {session:false}),protectByRole(["user"]),UserController.GETUser);
        this.read('/current', UserController.GETCurrentUser)

        //Endpoint PUT para actualizar el password del usurio logueado. http://localhost:8080/api/auth  -- SOLICITADO
        this.update('/', passportMW("current"), UserController.PUTLoggedUserPassword)

        //Endpoint PUT para actualizar el rol del usuario. http://localhost:8080/api/auth/users/premium/:uid
        this.update('/users/premium/:uid', UserController.PUTUserRole)

        //Endpoint PUT para actualizar el rol del usuario. http://localhost:8080/api/auth/prem  -- SOLICITADO
        this.update('/prem', passportMW("current"), UserController.PUTLogedUserRole)

        //Endpoint POST para cerrar sesion. http://localhost:8080/api/auth/signout -- SOLICITADO
        this.create('/signout', passportMW("current"), UserController.POSTSignout)

        //Redirecionador a github para inicio de sesion
        this.read('/github', passport.authenticate('github', { scope: ['user:email'] }), UserController.GETGithub);

        //Callback
        this.read('/callback', passport.authenticate('github', { failureRedirect: '/login' }), UserController.GETGithub);
    }
}