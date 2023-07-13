//Importaciones
import multer from "multer";
import { dirname } from "path";
import { fileURLToPath } from "url";

//Configuración de dirname
const __dirname = dirname("../"+fileURLToPath(import.meta.url));

//Configuración de multer
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    //cb(null, __dirname+"/public/img");
    cb(null, "../src/public/img");
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  }
});
export const upload = multer({ storage });