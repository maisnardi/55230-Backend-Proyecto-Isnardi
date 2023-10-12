import jwt  from "jsonwebtoken";
import { ENV } from "../config/config.js";

//Key de JWT
export const SECRET= ENV.SECRET;

//Middleware para proteger las vistas si el usuario no se encuentra logueado.
export const protectView = (req,res,next) =>{
    //console.log(req.user)
    if(!req.user) return res.status(403).redirect("/");
    next();
};

//Middleware para que el usuario no pueda volver a loguearse si ya se encuentra logueado con JWT y vistas.
export const isLogged = (req,res,next) =>{
    const token = req.cookies.accessToken;
    if(!token) next()
    else{
        try {
            const cookieValid = jwt.verify(token, SECRET);
            res.redirect("/products")
        } catch (error) {
            next()
        }
    }
}

//Middleware para proteger vistas por rol de usuario
export const protectByRole = (role) => (req, res, next) =>{
    console.log(req.user.role)
    if (req.user && req.user.role !== role)
        return res.status(403).redirect("/products");
    next();
}
