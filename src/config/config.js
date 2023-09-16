//Configuración de Commander para recibir por consola el puerto donde se debe ejecutar la APP. variables de entorno.
//Importación del modulo commander
import { Command } from "commander";        //Commander
import dotenv from "dotenv";                //Dotenv

//Configuración Commander
const parameters = new Command();

parameters.option("-p <PORT>", "App initialization port", 8080);                //Default port 8080.Ej: nodemon .\app.js -p 8083
parameters.option("-env <ENVIROMENT>", "Enviroment initialization", "DEV")      //Default enviroment DEV. Ej: nodemon .\app.js -p 8083 -env DEV
parameters.parse();

const ARGS = parameters.opts();
export default ARGS;

//Configuración dotenv
dotenv.config({
    path: '../.env'
});


