//Controller de API Products
//Importaciones
import ProductManager from "../services/products.service.js";
import { upload } from "../config/multer.js"
//import generateProduct from "../utils/genereateProducts.Faker.js"

//Imports de creación de errores
import CustomError from "../utils/Errors/CustomError.js";
import errorsDictionary from "../utils/Errors/EnumErrors.js";

//Instanciamos un nuevo productManager.
const productManager = new ProductManager("products");

//Controller GET Products with filters
export const GETProductsFilter = async (req, res, next) => {
    const { limit = 10, page = 1, sort, category, stock } = req.query;
    try {
        const products = await productManager.getProductsQuery(limit, page, sort, category, stock, next);               //Para uso con mongoProductManager
        if(products){
            if (products.payload.length > 0) {
                res.status(200).send({ error: false, message: "products found", payload: products })
            } else {
                return CustomError.new(errorsDictionary.notFound)
            }
        }else{
            return CustomError.new(errorsDictionary.invalid)
        }
    } catch (error) {
        error.from = "controller"
        return next(error)
    }
}

//Controller GET Product by ID
export const GETProductById = async (req, res, next) => {
    try {
        const { pid } = req.params;
        const product = await productManager.getProductById(pid, next); 
        if(product){
            if(typeof (product) === "string"){
                return CustomError.new(errorsDictionary.notFoundOne)
            }else{
                return res.status(200).send(product);
            }
        }else{
            return CustomError.new(errorsDictionary.invalid)
        }   
    } catch (error) {
        error.from = "controller"
        return next(error)
    }
}

//Controller POST Product with socket.io
export const POSTProduct = async (req, res, next) => {
    try {
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
        if (!body.title || !body.category || !body.description || !body.price || !body.code || !body.stock || !body.status) {
            return CustomError.new(errorsDictionary.incomplete)
        }
        const response = await productManager.addProduct(body, next);
        if(response){
            if (response[2]) {
                res.status(response[0].code).json({ status: response[1].status, payload: response[2].id.toString() });
            } else {
                res.status(response[0].code).json(response[1]);
            }
            //Emit de datos socket.io       
            if (response[1].status === "success") {
                req.io.emit("newProduct", body, response[2].id);
            }
            const products = await productManager.getProducts(next);
            req.io.emit("products", products);
        }else{
            return CustomError.new(errorsDictionary.productNotCreated)
        }

    } catch (error) {
        error.from = "controller"
        return next(error);
    }

}

//Controller PUT Update product
export const PUTUpdateProductsById = async (req, res, next) => {
    try {
        const properties = ["title", "category", "description", "price", "code", "stock", "status", "thumbnails" ];
        const photos = [];
        let body = {}
        const { pid } = req.params;
        if(req.files){
            if (req.files.length>0) {
                req.files.forEach((element) => {
                    photos.push(element.filename)
                })
                body = {
                    ...req.body,
                    thumbnails: photos
                }
            }else{
                body = {...req.body}
            }
        }
        else{
            body = {...req.body}
        }
        console.log(body)
        
        for (const key in body) {
            if(!properties.includes(key)){
                return CustomError.new(errorsDictionary.incomplete)
            }
        }
        const response = await productManager.updateProduct(pid, body, next);
        console.log(response)
        if(response){
            if(response === "updated"){
                res.status(200).send({ update: true })
            }else{
                return CustomError.new(errorsDictionary.notFoundOne)
            }
        }else{
            return CustomError.new(errorsDictionary.invalid)
        }

        // //Emit de datos socket.io     
        
        try {
            const products = await productManager.getProducts(next);
            req.io.emit("products", products);
        } catch (error) {
            error.from = "controller"
            return next(error);
        }
        
    } catch (error) {
        error.from = "controller"
        return next(error);
    }
}

//Controller DELETE Product
export const DELETEProductById = async (req, res, next) => {
    try {
        console.log("entro en borrar productos")
        const { pid } = req.params;
        const response = await productManager.deleteProduct(pid, next);
        console.log(response)
        if(response){
            {
                if (response[0].code === 404) {
                    return CustomError.new(errorsDictionary.notFoundOne)
                }
            }
            res.status(response[0].code).send(response[1]);
            //Emit de datos socket.io
            if (!response[1].error) {
                req.io.emit("delete", pid);
            }
        }else{
            return CustomError.new(errorsDictionary.invalid)
        }
    } catch (error) {
        error.from = "controller"
        return next(error);
    }
}

//Controller Multer Middleware
export const MDWMulter = upload.array('photo');




