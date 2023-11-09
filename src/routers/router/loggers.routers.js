//Routes de los endpoints de Loggers

//Importaciones
import CustomRouter from "../custom.router.js";
import * as LoggsApiController from "../../controllers/loggers.controller.js"

//Extendemos la clase LoggersRouter de nuestro Customrouter
export default class LoggersRouter extends CustomRouter {
    init() {
        //Endpoint de Mocking GET
        this.read('/', LoggsApiController.GETLoggers)
    }
}