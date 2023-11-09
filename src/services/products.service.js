//Importacion de modulos
import __dirname from "../dirname.js";
// import ProductModel from "../models/product.schema.js";
// import { ObjectId } from "mongodb";
//import Product  from "../dao/mongo/products.mongo.js"

import { ProductsDAO } from "../dao/factory.js";

//Instanciamos la clase Product
const ProductDAO = new ProductsDAO();

//Declaracion de clase ProductManager
class ProductManager {
    constructor() { };
    //Función privada que saca todos los espacios vacios que estan en los Values y devuelvo el objeto modificado.
    #modelData = (data) => {
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
    }

    //Función privada que valida la existencia de todos las Keys obligatorios. Devuelve true si existen todos y false si alguno no existe.
    #validateData = (data) => {
        if (!data.title || !data.description || !data.price || !data.code || !data.stock || !data.status || !data.category) {
            return false;
        }
        else {
            return true;
        }
    }

    //Función privada que verifica si el value de code ya se encuentra cargado en el array products.Si esta cargado devuelvo true, si no se encuentra devuelve false.
    #validateCode = async (code) => {
        let validate = false;
        try {
            //const value = await ProductModel.findOne({code:code});
            const value = await ProductDAO.findByCode(code);
            if (value) {
                validate = true;
            }
        } catch (error) {
            console.log(error)
        }
        return validate;
    }
    //Función privada y asincrona de utilidad para guardar en archivo
    // #writeFile = async(product)=>{
    //     await fs.promises.writeFile(this.path,JSON.stringify(product));
    // }

    //Función asíncrona que recibe como parametro un producto, realiza 3 verificaciones y si la información esta bien lo carga dentro del array products con un número de ID único.Trabaja con persistencia de archivo.
    addProduct = async (product) => {
        let status = [{ code: 200 }, { status: {} }, { id: 0 }];
        let data = this.#modelData(product)
        if (this.#validateData(data)) {
            if (await this.#validateCode(data.code)) {
                console.log("El producto ya se encuentra cargado");
                status = [{ code: 401 }, { error: "The product is already loaded." }];
            }
            else {
                try {
                    const a = await ProductDAO.insertProduct(data);
                    const newID = await ProductDAO.findByCode(data.code);
                    status = [{ code: 201 }, { status: "success" }, { id: newID._id.toString()}];
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
    }
    //Función asíncrona que devuelve por consola todos los productos cargados en el Array products en ATLAS.
    getProducts = async (limit) => {
        try {
            //const data = await ProductModel.find().limit(limit);
            const data = await ProductDAO.findWithLimit(limit);
            return data;
        } catch (e) {
            return e;
        }
    }

    //Función asíncrona que devuelve por consola todos los productos cargados en el Array products en ATLAS.
    getProductsQuery = async (uLimit, uPage, uSort, uCategory, uStock) => {
        let result;
        let data;
        let query = {}
        const option = {
            limit: uLimit,
            page: uPage,
        }
        if (uCategory) query.category = uCategory;
        if (uStock) query.stock = { $gte: 1 };
        if (uSort) {
            option.sort = { price: uSort }
            try {
                //data = await ProductModel.paginate(query,option);
                data = await ProductDAO.productPaginate(query, option);
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
            } catch (e) {
                return result.status = "error";
            }
        }
        else {
            try {
                //data = await ProductModel.paginate(query,option);
                data = await ProductDAO.productPaginate(query, option);
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
            } catch (e) {
                return result.status = "error";
            }
        }
    }

    //Función asíncrona que recibe como parametro un ID de un producto y lo busca dentro del array products en ATLAS. Si existe devuelve por consola el producto, si no arroja un mensaje indicando que el productno no existe. Trabaja con persistencia de archivo.
    getProductById = async (id) => {
        try {
            //const product = await ProductModel.findOne({_id: new ObjectId(id)});
            const product = await ProductDAO.findById(id);
            return product ? product : `ERROR: ID (${id}) not found`;
        } catch (error) {
            console.log(`ERROR: ID (${id}) not found`);
            console.log(`ERROR: ${error}`)
        }
    }

    //Función asíncrona que recibe como parametros el ID de un producto y los campos que se quieren actualizar de un producto y lo actualiza.Trabaja con persistencia de archivo.
    updateProduct = async (id, object) => {
        try {
            //const DbProduct = await ProductModel.findById({_id: new ObjectId(id)});
            const DbProduct = await ProductDAO.findById(id);
            if (DbProduct) {
                DbProduct.title = object.title ?? DbProduct.title;
                DbProduct.description = object.description ?? DbProduct.description;
                DbProduct.price = object.price ?? DbProduct.price;
                DbProduct.thumbnails = object.thumbnails ?? DbProduct.thumbnails;
                DbProduct.code = object.code ?? DbProduct.code;
                DbProduct.stock = object.stock ?? DbProduct.stock;

                await DbProduct.save();
                console.log(`El producto con ID (${DbProduct._id}) fue actualizado`);
                return "updated"
            } else {
                console.log(`No existe producto con ID (${DbProduct._id})`)
                return "badID"
            }
        } catch (error) {
            console.log(`ERROR al actualizar el archivo ${error}`)
        }
    }

    //Función asíncrona que recibe como parametro el ID de un producto y lo elimina del array de productos de Atlas.Trabaja con persistencia de archivo.
    deleteProduct = async (id) => {
        let status = [{ code: 200 }, { status: {} }];
        try {
            //const value = await ProductModel.deleteOne({_id: new ObjectId(id)});
            const value = await ProductDAO.deleteById(id);
            if (value.deletedCount === 0) {
                console.log(`Error: No se pudo eliminar el producto con ID (${id}) porque no existe`)
                status = [{ code: 404 }, { error: "ID not found" }];
            }
            else {
                console.log(`El producto con el ID (${id}) fue eliminado`);
                status = [{ code: 200 }, { deleted: "true." }];
            }
        }
        catch (e) {
            console.log(`Error: No se pudo eliminar el producto con ID (${id}): ${e}`)
            status = [{ code: 502 }, { error: true }]
        }
        return status;
    }
}

export default ProductManager;