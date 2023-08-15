//Importacion de modulos
import __dirname from "../../dirname.js";
import ProductModel from "../../models/product.schema.js";
import { ObjectId } from "mongodb";

//Declaracion de clase ProductManager
class ProductManager{
    constructor() {};
    //Función privada que saca todos los espacios vacios que estan en los Values y devuelvo el objeto modificado.
    #modelData = (data)=>{
        const modifiedData={
            title:data.title?.trim(),
            description:data.description?.trim(),
            price:Number(data?.price)<0 ? Number(data?.price)*-1 : Number(data?.price),
            thumbnails:data.thumbnails.length>0? data.thumbnails : [],
            code:data.code?.trim(),
            stock:Number(data?.stock)<0 ? Number(data?.stock)*-1 : Number(data?.stock),
            status: data.status==Boolean? data.status : true,
            category:data.category?.trim()
        }
        return modifiedData;
    }

    //Función privada que valida la existencia de todos las Keys obligatorios. Devuelve true si existen todos y false si alguno no existe.
    #validateData = (data)=>{
        if(!data.title || !data.description || !data.price || !data.code || !data.stock || !data.status || !data.category){
            return false;
        }
        else{
            return true;
        }
    }

    //Función privada que verifica si el value de code ya se encuentra cargado en el array products.Si esta cargado devuelvo true, si no se encuentra devuelve false.
    #validateCode = async (code)=>{
        let validate=false;
        try {
            const value = await ProductModel.findOne({code:code});
            if(value){
                validate=true;
            }
        } catch (error) {
            console.log(error)
        }
         return validate;   
    }

    //Función privada y asincrona de utilidad para guardar en archivo
    #writeFile = async(product)=>{
        await fs.promises.writeFile(this.path,JSON.stringify(product));
    }
    
    //Función asíncrona que recibe como parametro un producto, realiza 3 verificaciones y si la información esta bien lo carga dentro del array products con un número de ID único.Trabaja con persistencia de archivo.
    addProduct = async(product)=>{
        let status = [{code:200}, {status:{}}, {id:0}];
        let data = this.#modelData(product)
        if(this.#validateData(data))
        {
            if(await this.#validateCode(data.code)){
                console.log("El producto ya se encuentra cargado");
                status = [{code:400}, {error:"The product is already loaded."}];
            }
            else{              
                try {
                    const a = await ProductModel.insertMany([data]).ObjectId
                    const newID = await ProductModel.findOne({code:data.code});
                    status = [{code:200}, {posted:"True."}, {id:newID._id.toString()}];
                } catch (error) {
                    console.log(`ERROR al guardar el archivo ${error}`)
                    status = [{code:500}, {error: "File saving error"}];
                }
            }
        }else{
            console.log("Campos incompletos, por favor revíselos");
            status = [{code:400}, {error: "Incomplete fields, please check them."}];
        }
        return status;
    }

    //Función asíncrona que devuelve por consola todos los productos cargados en el Array products en ATLAS.
    getProducts = async (limit)=>{
        try{
            const data = await ProductModel.find().limit(limit);
            return data;
        }catch(e){
            return e;
        }
    }

    //Función asíncrona que recibe como parametro un ID de un producto y lo busca dentro del array products en ATLAS. Si existe devuelve por consola el producto, si no arroja un mensaje indicando que el productno no existe. Trabaja con persistencia de archivo.
    getProductById = async (id)=>{
        try {
            const product = await ProductModel.findOne({_id: new ObjectId(id)});
            return product ? product : `ERROR: ID (${id}) not found`;
        } catch (error) {
            console.log(`ERROR: ID (${id}) not found`);
            console.log(`ERROR: ${error}`)
        }        
    }

    //Función asíncrona que recibe como parametros el ID de un producto y los campos que se quieren actualizar de un producto y lo actualiza.Trabaja con persistencia de archivo.
    updateProduct = async (id,object)=>{
        try {
            const DbProduct = await ProductModel.findById({_id: new ObjectId(id)});
            if(DbProduct){
                DbProduct.title = object.title ?? DbProduct.title;
                DbProduct.description = object.description ?? DbProduct.description;
                DbProduct.price = object.price ?? DbProduct.price;
                DbProduct.thumbnails = object.thumbnails ?? DbProduct.thumbnails;
                DbProduct.code = object.code ?? DbProduct.code;
                DbProduct.stock = object.stock ?? DbProduct.stock;
        
                await DbProduct.save();
                console.log(`El producto con ID (${id}) fue actualizado`);
                return "updated"
            }else{
                console.log(`No existe producto con ID (${id})`)
                return "badID"
            }
            
        } catch (error) {
            console.log(`ERROR al actualizar el archivo ${error}`)
        }
    }

    //Función asíncrona que recibe como parametro el ID de un producto y lo elimina del array de productos de Atlas.Trabaja con persistencia de archivo.
    deleteProduct = async (id)=>{
        let status = [{code:200}, {status:{}}];
        try{
            const value = await ProductModel.deleteOne({_id: new ObjectId(id)});
            if(value.deletedCount===0)
            {
                console.log(`Error: No se pudo eliminar el producto con ID (${id}) porque no existe`)
                status=[{code:404}, {error:"ID not found"}];
            }
            else{
                console.log(`El producto con el ID (${id}) fue eliminado`);
                status=[{code:200}, {deleted:"true"}];
            }
        }
        catch(e){
            console.log(`Error: No se pudo eliminar el producto con ID (${id}): ${e}`)
            status=[{code:404}, {deleted:"false"}]
        }
        return status;
    }
}
export default ProductManager;