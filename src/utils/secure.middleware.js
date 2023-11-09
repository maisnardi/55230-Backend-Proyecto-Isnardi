import jwt from "jsonwebtoken";
import { ENV } from "../config/config.js";

//Key de JWT
export const SECRET = ENV.SECRET;

//Middleware para proteger las vistas si hay un usuario logueado si no hay lo devuele al login.
export const protectView = (req, res, next) => {
    const token = req.cookies.accessToken;
    console.log(token)
    if (!token) res.redirect("/")
    else {
        try {
            const cookieValid = jwt.verify(token, SECRET);
            next()
        } catch (error) {
            console.log(error)
            res.redirect("/")
        }
    }
}

//Middleware para que el usuario no pueda volver a loguearse si ya se encuentra logueado con JWT y vistas.
export const isLogged = (req, res, next) => {
    const token = req.cookies.accessToken;
    if (!token) next()
    else {
        try {
            const cookieValid = jwt.verify(token, SECRET);
            res.redirect("/products")
        } catch (error) {
            next()
        }
    }
}

//Middleware para proteger vistas por rol de usuario
export const protectByRole = (roles) => (req, res, next) => {
    const granted = roles.includes(req.user.role)
    if (req.user && !granted)
        return res.status(403).redirect("/products");
    next();
}

//Middleware de proteccion por rol para API.
export const protectByRoleApi = (roles) => (req, res, next) => {
    const granted = roles.includes(req.user.role)
    console.log(req.user.role);
    console.log(granted)
    if (req.user && !granted)
        return res.status(403).send({error:true, messagge:"No authorization"})
    next();
}
