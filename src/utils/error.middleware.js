//Importamos las config de winston
import logger from "../config/loggers/factory.js";

export default function (error, req, res, next) {
    console.log("entro al mid de errores")

    let status = error.status || 500;
    let from = `${req.method} ${req.url} ${error.from || "fatal"}`;
    let message = `${error.message[0].toUpperCase()}${error.message.slice(1).toLowerCase()}` || "error handler";

    //Para loggear el error
    req.logger = logger;
    req.logger.ERROR(`${req.method} ${req.url} - ${new Date().toLocaleTimeString()}`);

    console.log("status:", status, "from:", from, "message:", message)
    return res.status(status).json({ status, message, from });
}
