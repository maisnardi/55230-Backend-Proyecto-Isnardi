//Importacion de modulos
import __dirname from "../dirname.js";
// import ProductModel from "../models/product.schema.js";
// import { ObjectId } from "mongodb";
//import Product  from "../dao/mongo/products.mongo.js"
import CustomError from "../utils/Errors/CustomError.js";
import errorsDictionary from "../utils/Errors/EnumErrors.js";
import { ProductsDAO } from "../dao/factory.js";

//Instanciamos la clase Product
const ProductDAO = new ProductsDAO();

//Declaracion de clase ProductManager
class ProductManager {
    constructor() { };
    //Función privada que saca todos los espacios vacios que estan en los Values y devuelvo el objeto modificado.
    #modelData = (data, next) => {
        try {
            const modifiedData = {
            title: data.title?.trim(),
            description: data.description?.trim(),
            price: Number(data?.price) < 0 ? Number(data?.price) * -1 : Number(data?.price),
            thumbnails: data.thumbnails.length > 0 ? data.thumbnails : [],
            code: data.code?.trim(),
            stock: Number(data?.stock) < 0 ? Number(data?.stock) * -1 : Number(data?.stock),
            status: data.status == Boolean ? data.status : true,
            category: data.category?.trim(),
            owner: data.owner ? data.owner : "admin"
            }
            return modifiedData;
        } catch (error) {
            error.from = "service"
            return next(error);
        }

    }

    //Función privada que valida la existencia de todos las Keys obligatorios. Devuelve true si existen todos y false si alguno no existe.
    #validateData = (data,next) => {
        try {
            if (!data.title || !data.description || !data.price || !data.code || !data.stock || !data.status || !data.category) {
                return false;
            }
            else {
                return true;
            }
        } catch (error) {
            error.from = "service"
            return next(error);
        }
    }

    //Función privada que verifica si el value de code ya se encuentra cargado en el array products.Si esta cargado devuelvo true, si no se encuentra devuelve false.
    #validateCode = async (code, next) => {
        let validate = false;
        try {
            //const value = await ProductModel.findOne({code:code});
            const value = await ProductDAO.findByCode(code, next);
            if (value) {
                validate = true;
            }
            return validate;
        } catch (error) {
            error.from = "service"
            return next(error);
        }
    }

    //Función asíncrona que recibe como parametro un producto, realiza 3 verificaciones y si la información esta bien lo carga dentro del array products con un número de ID único.
    addProduct = async (product, next) => {
        try {
            let status = [{ code: 200 }, { status: {} }, { id: 0 }];
            let data = this.#modelData(product, next)
            if (this.#validateData(data, next)) {
                if (await this.#validateCode(data.code, next)) {
                    console.log("El producto ya se encuentra cargado");
                    status = [{ code: 401 }, { error: "The product is already loaded." }];
                }
                else {
                    try {
                        const a = await ProductDAO.insertProduct(data, next);
                        const newID = await ProductDAO.findByCode(data.code, next);
                        status = [{ code: 201 }, { status: "success" }, { id: newID._id.toString() }];
                    } catch (error) {
                        console.log(`ERROR al guardar el archivo ${error}`)
                        status = [{ code: 500 }, { error: "File saving error" }];
                    }
                }
            } else {
                console.log("Campos incompletos, por favor revíselos");
                status = [{ code: 400 }, { error: "Incomplete fields, please check them." }];
            }
            return status;
        } catch (error) {
            error.from = "service"
            return next(error);
        }

    }
    //Función asíncrona que devuelve por consola todos los productos cargados en el Array products en ATLAS.
    getProducts = async (limit, next) => {
        try {
            //const data = await ProductModel.find().limit(limit);
            const data = await ProductDAO.findWithLimit(limit, next);
            return data;
        } catch (error) {
            error.from = "service"
            return next(error);
        }
    }

    //Función asíncrona que devuelve por consola todos los productos cargados en el Array products en ATLAS.
    getProductsQuery = async (uLimit, uPage, uSort, uCategory, uStock, next) => {
        try {
            let result;
            let data;
            let query = {}
            const option = {
                limit: uLimit,
                page: uPage,
            }
            if (uCategory) query.category = uCategory;
            if (uStock){
                if(uStock == "true"){
                    query.stock = {$gt: 1}
                }else{
                    query.stock = {$lte: 0}
                }
            } 
            if (uSort) {
                option.sort = { price: uSort }
                try {
                    //data = await ProductModel.paginate(query,option);
                    data = await ProductDAO.productPaginate(query, option, next);
                    const { docs, totalPages, prevPage, nextPage, page, hasPrevPage, hasNextPage } = data;
                    result = {
                        status: "success",
                        payload: docs,
                        totalPages: totalPages,
                        prevPage: prevPage,
                        nextPage: nextPage,
                        page: page,
                        hasPrevPage: hasPrevPage,
                        hasNextPage: hasNextPage,
                        prevLinkAPI: hasPrevPage == false ? null : `localhost:8080/api/products/?limit=${uLimit}&page=${prevPage}&sort=${uSort}`,
                        nextLinkAPI: hasNextPage == false ? null : `localhost:8080/api/products/?limit=${uLimit}&page=${nextPage}&sort=${uSort}`,
                        prevLink: hasPrevPage == false ? null : `?limit=${uLimit}&page=${prevPage}&sort=${uSort}`,
                        nextLink: hasNextPage == false ? null : `?limit=${uLimit}&page=${nextPage}&sort=${uSort}`
                    }
                    return result;
                } catch (error) {
                    error.from = "service";
                    return next(error)
                }
            }
            else {
                try {
                    //data = await ProductModel.paginate(query,option);
                    data = await ProductDAO.productPaginate(query, option, next);
                    const { docs, totalPages, prevPage, nextPage, page, hasPrevPage, hasNextPage } = data;
                    result = {
                        status: "success",
                        payload: docs,
                        totalPages: totalPages,
                        prevPage: prevPage,
                        nextPage: nextPage,
                        page: page,
                        hasPrevPage: hasPrevPage,
                        hasNextPage: hasNextPage,
                        prevLinkAPI: hasPrevPage == false ? null : `localhost:8080/api/products/?limit=${uLimit}&page=${prevPage}`,
                        nextLinkAPI: hasNextPage == false ? null : `localhost:8080/api/products/?limit=${uLimit}&page=${nextPage}`,
                        prevLink: hasPrevPage == false ? null : `?limit=${uLimit}&page=${prevPage}`,
                        nextLink: hasNextPage == false ? null : `?limit=${uLimit}&page=${nextPage}`
                    }
                    return result;
                } catch (error) {
                    error.from = "service";
                    return next(error)
                }
            }
        } catch (error) {
            error.from = "service";
            return next(error)
        }
    }

    //Función asíncrona que recibe como parametro un ID de un producto y lo busca dentro del array products en ATLAS. Si existe devuelve por consola el producto, si no arroja un mensaje indicando que el productno no existe.
    getProductById = async (id, next) => {
        try {
            //const product = await ProductModel.findOne({_id: new ObjectId(id)});
            const product = await ProductDAO.findById(id, next);
            return product ? product : `ERROR: ID (${id}) not found`;
        } catch (error) {
            error.from = "service";
            return next(error)
        }
    }

    //Función asíncrona que recibe como parametros el ID de un producto y los campos que se quieren actualizar de un producto y lo actualiza.
    updateProduct = async (id, object, next) => {
        try {
            if (object.title) {
                if (object.title.trim() == 0) {
                    object.title = null;
                } else {
                    object.title = object.title.trim();
                }
            } else {
                object.title = null;
            }
            if (object.description) {
                if (object.description.trim() == 0) {
                    object.description = null;
                } else {
                    object.description = object.description.trim();
                }
            } else {
                object.description = null;
            }
            if (object.code) {
                if (object.code.trim() == 0) {
                    object.code = null;
                } else {
                    object.code = object.code.trim();
                }
            } else {
                object.code = null;
            }
            if (object.stock) {
                object.stock = object.stock;
            } else {
                object.stock = null;
            }
            if (object.price) {
                object.price = object.price;
            } else {
                object.price = null;
            }
            const DbProduct = await ProductDAO.findById(id, next);
            // console.log(DbProduct);
            if (DbProduct) {
                DbProduct.title = object.title ?? DbProduct.title;
                DbProduct.description = object.description ?? DbProduct.description;
                DbProduct.price = object.price ?? DbProduct.price;
                DbProduct.thumbnails = object.thumbnails ?? DbProduct.thumbnails;
                DbProduct.code = object.code ?? DbProduct.code;
                DbProduct.stock = object.stock ?? DbProduct.stock;
                // console.log(DbProduct)
                await DbProduct.save();
                console.log(`El producto con ID (${DbProduct._id}) fue actualizado`);
                return "updated"
            } else {
                console.log(`No existe producto con ID (${DbProduct._id})`)
                return "badID"
            }
        } catch (error) {
            console.log(`ERROR al actualizar el archivo ${error}`)
            error.from = "service";
            return next(error)
        }
    }

    //Función asíncrona que recibe como parametro el ID de un producto y lo elimina del array de productos de Atlas.
    deleteProduct = async (id, next) => {
        let status = [{ code: 200 }, { status: {} }];
        try {
            //const value = await ProductModel.deleteOne({_id: new ObjectId(id)});
            const value = await ProductDAO.deleteById(id, next);
            if (value.deletedCount === 0) {
                status = [{ code: 404 }, { error: "ID not found" }]
            }
            else {
                status = [{ code: 200 }, { deleted: true }];
            }
            return status;
        }
        catch (error) {
            error.from = "service";
            return next(error)
        }
        
    }

    //Función asíncrona que recibe como parametro el ID un owner y devuelve sus productos.
    getProductsByOwner = async (owner, next) => {
        try {
            const products = await ProductDAO.findByOwner(owner, next);
            return products;
        } catch (error) {
            error.from = "service";
            return next(error)
        }
    }
}

export default ProductManager;