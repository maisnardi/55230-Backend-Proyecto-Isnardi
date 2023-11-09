//Routes de los endpoints de Mocks de Faker

//Importaciones
import CustomRouter from "../custom.router.js";
import * as MocksApiController from "../../controllers/mocks.controller.js"

//Extendemos la clase MockRouter de nuestro Customrouter
export default class MockRouter extends CustomRouter {
    init() {
        //Endpoints para express

        //Endpoint de Mocking GET
        this.read('/mockingproducts',MocksApiController.GETMockingProducts);
    }
}