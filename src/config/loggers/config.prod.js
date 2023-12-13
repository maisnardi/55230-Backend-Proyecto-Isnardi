//Configuracion logger para el ambiente de produccion
import { createLogger, format, transports, addColors } from "winston";


const { simple, colorize } = format;

//Definimos la jerarquía del sistema de niveles

const levels = {
    ERROR: 1,
    INFO: 2,
    HTTP: 3
}

//Definimos la jerarquía del sistema de colores para los levels.

const colors = {
    ERROR: 'red',
    INFO: 'blue',
    HTTP: 'white'
} 

addColors(colors);

//Exportamos el creador de registro con sus propiedades
export default createLogger({
    levels,
    format: colorize(),
    transports: [
        new transports.Console({
            level: 'INFO',
            format: simple()
        }),
        new transports.File({
            level: 'ERROR',
            format: simple(),
            filename: "./errors.log"
        }),
    ]


})