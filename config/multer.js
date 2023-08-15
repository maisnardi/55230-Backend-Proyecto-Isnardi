//Importaciones
import multer from "multer";
import __dirname from "../dirname.js"

//Configuración de multer
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, __dirname+"/public/img");
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  }
});
export const upload = multer({ storage });