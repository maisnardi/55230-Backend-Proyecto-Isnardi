//Controller de Users Views
//Importaciones
import { el } from "@faker-js/faker";
import UserManager from "../services/user.service.js";
import { generateToken } from "../utils/jwt.js";



//Instanciamos un nuevo productManager.
const userManager = new UserManager();

//Controller GET vista Login.
export const GETLoginView = async (req, res, next) => {
    try {
        //const users = await userManager.getUsers(next);
        res.render('login')
    } catch (error) {
        //res.status(502).send({ error: true, message: error });
        error.from = "controller";
        return next(error);
    }
}
//Controller GET vista Register.
export const GETRegisterView = async (req, res, next) => {
    try {
        res.render("register")
    } catch (error) {
        error.from = "controller";
        return next(error);
    }
}

//Controller GET vista Profile.
export const GETProfileView = async (req, res, next) => {
    try {
        const userData = {
            first_name: req.user.first_name.trim().length > 0 ? req.user.first_name : false,
            last_name: req.user.last_name.trim().length > 0 ? req.user.last_name : false,
            age: req.user.age.trim().length > 0 ? req.user.age : false,
            username: req.user.username.trim().length > 0 ? req.user.username : false,
            email: req.user.email,
            role: req.user.role,
            display:req.display,
        }
        res.render("profile", userData)
    } catch (error) {
        error.from = "controller";
        return next(error);
    }

}

//Controller GET vista Logout.
export const GETLogoutView = async (req, res, next) => {
    try {
            const test = res.clearCookie('accessToken', {
            httpOnly: true,
        });
        req.session.destroy((error) => {
        res.redirect("/");
    });
    } catch (error) {
        error.from = "controller";
        return next(error);
    }

}

//Controller POST
export const POSTNone = async (req, res, next) => {
}

//Controller GET vista Restore Password.
export const GETRestoreView = async (req, res, next) => {
    try {
        res.render("restorePassword");
    } catch (error) {
        error.from = "controller";
        return next(error);
    }

}

//Controller GET vista User reset password.
export const GETUserResetPasswordView = async (req, res, next) => {
    try {
        const { userID } = req.params;
        const user = await userManager.getUserById(userID, next)
        res.render("restoreUserPassword", { user: user.email, id: user._id.toString() });
    } catch (error) {
        error.from = "controller";
        return next(error);
    }
}

//Controller GET vista Index.
export const GETIndex = async (req, res, next) => {
    try {
        res.render("index", {display:req.display});
    } catch (error) {
        error.from = "controller";
        return next(error);
    }
}

//Controller GET vista Premium.
export const GETPremiumView = async (req, res, next) => {
    try {
        const display = req.display;
        res.render("premium", {display:display});
    } catch (error) {
        error.from = "controller";
        return next(error);
    }
}

//Controller GET vista usuario logeado cambio de clave
export const GETChangePasswordView = async (req,res, next) =>{
    try {
        const render={
            display:req.display
        }
        res.render("changePassword", render)
    } catch (error) {
        error.from = "controller";
        return next(error);
    }
}

//Controller GET vista usuario logeado cambio de clave confirmacion email.
export const GETLoggedUserResetPasswordView = async (req, res, next) => {
    try {
        const { userID } = req.params;
        const user = await userManager.getUserById(userID, next)
        res.render("changeUserPassword", { user: user.email, id: user._id.toString() });
    } catch (error) {
        error.from = "controller";
        return next(error);
    }
}