//Routes de los endpoints de Auth

//Importaciones
import CustomRouter from "../custom.router.js";
import passport from "passport";
import * as AuthController from "../../controllers/auth.controller.js"

//Extendemos la clase Authrouter de nuestro Customrouter
export default class AuthRouter extends CustomRouter {
    init() {
        //Endpoints para express

        //Redirecionador a github para inicio de sesion
        this.read('/github', passport.authenticate('github',{scope:['user:email']}), AuthController.GET);

        //Callback
        this.read('/callback',passport.authenticate('github', {successRedirect:'/products',failureRedirect:'/login'}), AuthController.GET);
    }
}