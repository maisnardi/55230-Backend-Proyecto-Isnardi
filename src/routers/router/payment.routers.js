//Routes de los endpoints de Payment http://localhost:8080/api/payments/intents

//Importaciones
import CustomRouter from "../custom.router.js";
import * as PaymentApiController from "../../controllers/payments.controller.js"
import passportMW from "../../utils/passport.middleware.js";
import { protectByRoleApi } from "../../utils/secure.middleware.js";

//Extendemos la clase PaymentsRouter de nuestro Customrouter
export default class PaymentsRouter extends CustomRouter {
    init() {
        //Endpoints para express
        //Endpoint POST Payment. http://localhost:8080/api/payments/intents
        this.create('/intents', passportMW("current"),protectByRoleApi(["user","premium"]), PaymentApiController.POSTPayment);
    }
}