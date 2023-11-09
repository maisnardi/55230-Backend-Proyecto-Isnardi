//Configuración de Swagger
import __dirname from "../dirname.js"

//Configuraciones
const options = {
    definition:{
        openapi:"3.0.1",
        info:{
            title:"Coder backend App",
            description:"Ecommerse App for the Coderhouse backend course - Commission 55230"
        }
    },
    apis:[__dirname+"/config/docs/*.yaml"]
}

export default options;