//Importacion de módulos
import { dirname } from "path";
import { fileURLToPath } from "url";

//Configuración de dirname
const __dirname = dirname(fileURLToPath(import.meta.url));
export default __dirname;