//Routes de los endpoints de Users hhttp://localhost:8080/api/

//Importaciones
import CustomRouter from "../custom.router.js";
import * as UserController from "../../controllers/users.controller.js"
import { protectByRole, protectView } from "../../utils/secure.middleware.js";
import passport from "passport";


//Extendemos la clase UsersRouter de nuestro Customrouter
export default class UsersRouter extends CustomRouter {
    init() {
        //Endpoints para express
        //Endpoint POST User.
        this.create('/', UserController.POSTUser)

        //Endpoint POST User con passport.
        this.create('/register', passport.authenticate("register"), UserController.POSTNone)

        //Endpoint POST User para login JWT.
        //this.create('/login', UserController.POSTUserLogin)
        this.create("/login", passport.authenticate("login"), UserController.POSTUserLogin)

        //Endpoint GET Users.
        this.read('/', UserController.GETAllUsers)

        //Endpoint GET User para profile.
        //this.read('/current', passport.authenticate ('current', {session:false}),protectByRole(["user"]),UserController.GETUser);
        this.read('/current', UserController.GETCurrentUser)

        //Endpoint PUT para actualizar el rol del usuario.
        this.update('/users/premium/:uid', UserController.PUTUserRole)
    }
}