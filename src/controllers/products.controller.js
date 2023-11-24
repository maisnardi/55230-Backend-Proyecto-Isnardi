//Controller de API Products
//Importaciones
import ProductManager from "../services/products.service.js";
import { upload } from "../config/multer.js"
//import generateProduct from "../utils/genereateProducts.Faker.js"

//Imports de creación de errores
import CustomError from "../utils/Errors/customError.js";
import errorsDictionary from "../utils/Errors/EnumErrors.js";

//Instanciamos un nuevo productManager.
const productManager = new ProductManager("products");

//Controller GET Products with filters
export const GETProductsFilter = async (req, res, next) => {
    const { limit = 10, page = 1, sort, category, stock } = req.query;
    try {
        const products = await productManager.getProductsQuery(limit, page, sort, category, stock, next);               //Para uso con mongoProductManager
        //limit? res.send(products.slice(0,limit)) : res.send(products);        //Para uso con ProductManager (FS)
        if (products.payload.length > 0) {
            res.status(200).send({ error: false, message: "products found", payload: products })
        } else {
            //res.status(404).send({ error: false, message: "No matching products" })
            CustomError.new(errorsDictionary.notFoundProducts)
        }
    } catch (error) {
        //res.status(502).send({ error: true, message: "Invalid request" }); NO BORRAR
        error.from = "controller"
        return next(error)
    }
}

//Controller GET Product by ID
export const GETProductById = async (req, res, next) => {
    try {
        const { pid } = req.params;
        const product = await productManager.getProductById(pid, next);    
        typeof (product) === "string" ? res.status(404).send(product) : res.status(200).send(product);
    } catch (e) {
        res.status(502).send({ error: true });
    }
}

//Controller POST Product with socket.io
export const POSTProduct = async (req, res, next) => {
    try {
        console.log("entro al endpoint api product post")
        console.log(req.body)
        console.log(req.files)
        const photos = [];
        if (req.files) {
            if (req.files.length > 0) {
                req.files.forEach((element) => {
                    photos.push(element.filename)
                })
            }
        }
        if (req.body.thumbnails)
            if (Array.isArray(req.body.thumbnails)) {
                req.body.thumbnails.forEach((element) => {
                    photos.push(element)
                });
            }
            else {
                photos.push(req.body.thumbnails)
            }
        const body = {
            ...req.body,
            thumbnails: photos,
            owner: req.user._id
        };
        // if (!body.title || !body.category || !body.description || !body.price || !body.code || !body.stock || !body.status) {
        //     CustomError.createError({
        //         message: "PRODUCT CREATE ERROR",
        //         cause: generateProductErrorInfo(body),
        //         name: "New product error",
        //         code: EErrors.USER_INPUT_ERROR,
        //     })
        // }
        const response = await productManager.addProduct(body, next);
        if (response[2]) {
            res.status(response[0].code).send({ status: response[1].status, payload: response[2].id.toString() });
        } else {
            res.status(response[0].code).send(response[1]);
        }


        //Emit de datos socket.io       
        if (response[1].status === "success") {
            req.io.emit("newProduct", body, response[2].id);
        }

        const products = await productManager.getProducts();
        req.io.emit("products", products);
    } catch (error) {
        console.log(error)
        res.status(502).send({ error: true, message: error });
    }

}

//Controller PUT Update product
export const PUTUpdateProductsById = async (req, res, next) => {
    try {
        console.log("entro")
        const photos = [];
        let body = {}
        const { pid } = req.params;
        console.log(pid)
        if(req.files){
            if (req.files.length>0) {
                req.files.forEach((element) => {
                    photos.push(element.filename)
                })
                body = {
                    ...req.body,
                    thumbnails: photos
                }
            }
        }
        else{
            body = {...req.body}
        }
        const response = await productManager.updateProduct(pid, body, next);
        response === "updated" ? res.status(200).send({ update: true }) : res.status(404).send({ error: "ID not found" })

        //Emit de datos socket.io     
        const products = await productManager.getProducts(next);
        req.io.emit("products", products);
    } catch (e) {
        res.status(502).send({ error: true });
    }
}

//Controller DELETE Product
export const DELETEProductById = async (req, res, next) => {
    try {
        console.log("entro en borrar productos")
        const { pid } = req.params;
        const response = await productManager.deleteProduct(pid, next);
        res.status(response[0].code).send(response[1]);

        //Emit de datos socket.io
        if (!response[1].error) {
            req.io.emit("delete", pid);
        }
    } catch (error) {
        res.status(502).send({ error: true });
    }
}

//Controller Multer Middleware
export const MDWMulter = upload.array('photo')
;

