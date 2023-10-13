//Configuracion logger para el ambiente de produccion
import { createLogger,format, transports,addColors } from "winston";


const {simple, colorize}= format;

//Definimos la jerarquía del sistema de niveles
const levels = {
    FATAL: 1,
    ERROR: 2,
    WARNING:3,
    INFO:4,
    HTTP:5
}

//Definimos la jerarquía del sistema de colores para los levels.
const colors = {
    FATAL: 'red',
    ERROR: 'yellow',
    WARNING:'white',
    INFO:'green',
    HTTP:'blue'
};

addColors(colors);

//Exportamos el creador de registro con sus propiedades
export default createLogger({
    levels,
    format:colorize(),
    transports:[
       new transports.Console({
            level:'HTTP',
            format:simple()
       }),
       new transports.File({
            level:'WARNING',
            format:simple(),
            filename: "./errors.log"
        }),
    ]


})