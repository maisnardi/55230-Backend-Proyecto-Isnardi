//Controller de Products view
//Importaciones
import ProductManager from "../services/products.service.js";
import { upload } from "../config/multer.js";       //Multer

//Imports de creación de errores
import CustomError from "../utils/Errors/customError.js";
import EErrors from "../utils/Errors/EnumErrors.js";

//Instanciamos un nuevo productManager.
const productManager = new ProductManager("products");

//Controller GET Products in Home View
export const GETProductsInHomeView = async (req, res) => {
    try {
        await productManager.getProducts().then(products => {
            const productsObj = products.map(product => product.toObject())
            if (req.user.role === 'premium') {
                productsObj.forEach(element => {
                    if (element.owner != "admin") {
                        if (element.owner.toString() === req.user._id.toString()) element.render = true;
                    }
                })
                res.render("home", { products: productsObj, filter: true })
            }
            else {
                productsObj.forEach(element => { element.render = true })
                res.render("home", { products: productsObj })
            }
        });
        // res.render("home",{products:products});    
    } catch (e) {
        console.log(e)
        res.status(502).send({ error: true });
    }
}


//Controller GET Realtimeproducts
export const GETRealTimeProducts = async (req, res, next) => {
    try {
        res.render("realTimeProducts")
        const products = await productManager.getProducts();
        req.io.on('connection', socket => {
            req.io.emit("products", products)
        })
        console.log("se enviaron los productos")
    } catch (error) {
        res.status(502).send({ error: true, message: error });
    }
}

//Controller GET AllProducts View
export const GETAllProductsView = async (req, res) => {
    const { limit = 10, page = 1, sort, category, stock } = req.query;
    try {
        const products = await productManager.getProductsQuery(limit, page, sort, category, stock);
        const ObjProducts = products.payload.map((product => product.toObject()));
        // console.log(ObjProducts)
        const user = req.user;
        const dataToRender = {
            nlink: products.nextLink,
            plink: products.prevLink ? products.prevLink : false,
            page: products.page,
            products: ObjProducts,
            user: user.first_name.trim().length > 0 ? user.first_name + " " + user.last_name : user.username,
            role: user.role === "admin" || user.role === "premium" ? true : false,
            cid: user.cartId.toString(),
            cart: user.cartId
        }
        res.render("products", dataToRender)
    } catch (error) {
        res.status(502).send({ error: true, message: error });
    }
}

//Controller GET Product by ID
export const GETProductByIdView = async (req, res) => {
    try {
        const { pid } = req.params;
        const product = await productManager.getProductById(pid)
        const jsonProduct = product.toJSON();
        const displaydata = {
            product: jsonProduct,
            role: req.user.role === "user" ? true : false,
            cid: req.user.cartId.toString()
        }
        res.render("product", displaydata)
    } catch (error) {
        res.status(502).send({ error: true, message: error });
    }
}

//Controller GET Product by ID home
export const GETProductByIdViewHome = async (req, res) => {
    try {
        const { pid } = req.params;
        const product = await productManager.getProductById(pid)
        const jsonProduct = product.toJSON();
        res.render("modifyProduct", jsonProduct)
    } catch (error) {
        res.status(502).send({ error: true });
    }
}

//Controller Multer Middleware
export const MDWMulter = upload.array('photo');