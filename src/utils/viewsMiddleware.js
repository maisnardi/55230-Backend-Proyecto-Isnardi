//Middleware de vistas
import jwt from "jsonwebtoken";
import { ENV } from "../config/config.js";

//Key de JWT
export const SECRET = ENV.SECRET;

//Middleware para configurar el navbar segun el roll del usuario
export const navbarView = (req, res, next) => {
        let display = {};
        try{
            const token = req.cookies.accessToken;
            console.log(token)
            if (!token) {
                display = {
                    cart: false,
                    register: true,
                    login: true,
                    premium: false,
                    new: false,
                    update: false,
                    chat: false,
                    buy: false,
                    realtime: false,
                    premium: false,
                    logged: false,
                }
            }else {
                const cookieValid = jwt.verify(token, SECRET);
                console.log(cookieValid)
                if (req.user) {
                    if (req.user.role === "admin") {
                        display = {
                            cart: false,
                            register: true,
                            login: false,
                            premium: false,
                            new: true,
                            update: true,
                            logout: true,
                            chat: false,
                            buy: false,
                            realtime:true,
                            premium: false,
                            logged: true,
                        }
                    }
                    if (req.user.role === "premium") {
                        display = {
                            cart: true,
                            register: false,
                            login: false,
                            premium: false,
                            new: true,
                            update: true,
                            logout: true,
                            chat: true,
                            buy: true,
                            realtime: false,
                            premium: false,
                            logged: true,
                        }
                    }
                    if (req.user.role === "user") {
                        display = {
                            cart: true,
                            register: false,
                            login: false,
                            premium: true,
                            new: false,
                            update: false,
                            logout: true,
                            chat: true,
                            buy: true,
                            realtime: false,
                            premium: false,
                            logged: true,
                        }
                    }
                } else {
                    display = {
                        cart: false,
                        register: true,
                        login: true,
                        premium: false,
                        new: false,
                        update: false,
                        chat: false,
                        buy: false,
                        realtime: false,
                        premium:false,
                        logged: false,
                    }
                }
            }
            req.display = display;
            next();
        } catch (error) {
        console.log(error)
        next();
    }
}

