//Importacion de modulos
import fs from "fs";    //FileSystem

//Declaracion de clase ProductManager
class ProductManager{
    //declaro el constructor
    constructor(path){
        this.products=[];
        this.path=path;
    }

    //Función privada que saca todos los espacios vacios que estan en los Values y devuelvo el objeto modificado.
    #modelData = (data)=>{
        const modifiedData={
            title:data.title?.trim(),
            description:data.description?.trim(),
            price:Number(data?.price)<0 ? Number(data?.price)*-1 : Number(data?.price),
            thumbnail:data.thumbnail?.trim(),
            code:data.code?.trim(),
            stock:Number(data?.stock)<0 ? Number(data?.stock)*-1 : Number(data?.stock)
        }
        return modifiedData;
    }

    //Función privada que valida la existencia de todos las Keys obligatorios. Devuelve true si existen todos y false si alguno no existe.
    #validateData = (data)=>{
        if(!data.title || !data.description || !data.price || !data.thumbnail || !data.code || !data.stock){
            return false;
        }
        else{
            return true;
        }
    }

    //Función privada que verifica si el value de code ya se encuentra cargado en el array products.Si esta cargado devuelvo true, si no se encuentra devuelve false.
    #validateCode = (code)=>{
        let validate=false;
        if(this.products.length>0){
            this.products.forEach(element => {
                if(element.code===code) {
                    validate=true;
                }
            });  
        }
         return validate;   
    }

    //Función asíncrona que recibe como parametro un producto, realiza 3 verificaciones y si la información esta bien lo carga dentro del array products con un número de ID único.Trabaja con persistencia de archivo.
    addProduct = async(product)=>{
        let data=this.#modelData(product)
        try {
            this.products = JSON.parse(await fs.promises.readFile(this.path,"utf-8"));
        } catch (error) {
            console.log("El Archivo no existe, creandolo...")
        }
        if(this.#validateData(data))
        {
            if(this.#validateCode(data.code)){
                console.log("El producto ya se encuentra cargado");
            }
            else{
                data={
                    ...data,
                    id:this.products.length == 0 ? 1 : this.products[this.products.length - 1].id + 1  
                }
                this.products.push(data)
                
                try {
                    await fs.promises.writeFile(this.path,JSON.stringify(this.products));
                    console.log("El producto fue cargado");
                } catch (error) {
                    console.log(`ERROR al guardar el archivo ${error}`)
                }
            }
        }else{
            console.log("Campos incompletos, por favor revíselos");
        }
    }

    //Función asíncrona que devuelve por consola todos los productos cargados en el Array products.Trabaja con persistencia de archivo.
    getProducts = async ()=>{
        console.log("Lista de productos:")
        try{
            const data = JSON.parse(await fs.promises.readFile(this.path,"utf-8"));
            console.log(JSON.parse(data))
        }catch(e){
            console.log([]);
        }
    }

    //Función asíncrona que recibe como parametro un ID de un producto y lo busca dentro del array products. Si existe devuelve por consola el producto, si no arroja un mensaje indicando que el productno no existe. Trabaja con persistencia de archivo.
    getProductById = async (id)=>{
        let data=[];
        try {
            data = JSON.parse(await fs.promises.readFile(this.path,"utf-8"));
            const product= data.find(element => element.id===id)
            product ? console.log(`Producto encontrado: \n ${JSON.stringify(product,null,2)}`) : console.log(`ERROR: Not found ID (${id})`);
        } catch (error) {
            console.log(`ERROR: Not found ID (${id})`);
            console.log(`ERROR: ${error}`)
        }        
    }

    //Función asíncrona que recibe como parametros el ID de un producto y los campos que se quieren actualizar de un producto y lo actualiza.Trabaja con persistencia de archivo.
    updateProduct = async (id,object)=>{
        let data=[];
        try {
            data = JSON.parse(await fs.promises.readFile(this.path,"utf-8"));
        } catch (error) {
            console.log(`ERROR: ${error}`);
        }        
        const index= data.findIndex(element => element.id===id);
        if(index>=0){
            data[index].title = object.title ?? data[index].title;
            data[index].description = object.description ?? data[index].description;
            data[index].price = object.price ?? data[index].price;
            data[index].thumbnail = object?.thumbnail;
            data[index].code = object.code ?? data[index].code;
            data[index].stock = object.stock ?? data[index].stock;
            this.products=data;
            try {
                await fs.promises.writeFile(this.path,JSON.stringify(this.products));
                console.log(`El producto con ID (${id}) fue actualizado`);
            } catch (error) {
                console.log(`ERROR al actualizar el archivo ${error}`)
            }
        }
        else console.log(`No existe producto con ID (${id})`)
    }

    //Función asíncrona que recibe como parametro el ID de un producto y lo elimina del listado del productos.Trabaja con persistencia de archivo.
    deleteProduct = async (id)=>{
        let data=[];
        try {
            data = JSON.parse(await fs.promises.readFile(this.path,"utf-8"));
        } catch (error) {
            console.log(error);
        }        
        const index= data.findIndex(element => element.id===id);
        if(index>=0){
            data.splice(index,1);
            this.products=data;
            try {
                await fs.promises.writeFile(this.path,JSON.stringify(this.products));
                console.log(`El producto con el ID (${id}) fue eliminado`);
            } catch (error) {
                console.log(`ERROR: al modificar el archivo`)
                console.log(`ERROR: ${error}`)
            }
        }
        else console.log(`Error: No se pudo eliminar el producto con ID (${id}) porque no existe`)
    }
}



//Testing
// const user = new ProductManager("../products.json");
// await user.getProducts();
// await user.addProduct({title: `producto prueba`,
//     description:`Este es un producto prueba`,
//     price:200,
//     thumbnail:`Sin imagen`,
//     code:`abc123`,
//     stock:25
//     })

// await user.addProduct({title: "producto prueba2",
//     description:"Este es un producto prueba",
//     price:2002,
//     thumbnail:"Sin imagen",
//     code:"abc2",
//     stock:25})

// await user.addProduct({title: "producto prueba3",
//     description:"Este es un producto prueba",
//     price:200,
//     thumbnail:"Sin imagen",
//     code:"abc3",
//     stock:25})

// await user.addProduct({title: "producto prueba4",
//     description:"Este es un producto prueba",
//     price:2002,
//     thumbnail:"Sin imagen",
//     code:"abc4",
//     stock:25})

// await user.addProduct({title: "producto prueba5",
//     description:"Este es un producto prueba",
//     price:200,
//     thumbnail:"Sin imagen",
//     code:"abc5",
//     stock:25})

// await user.addProduct({title: "producto prueba6",
//     description:"Este es un producto prueba",
//     price:200,
//     thumbnail:"Sin imagen",
//     code:"abc6",
//     stock:25})

// await user.addProduct({title: "producto prueba7",
//     description:"Este es un producto prueba",
//     price:200,
//     thumbnail:"Sin imagen",
//     code:"abc7",
//     stock:25})


// await user.getProductById(1);
// await user.deleteProduct(6);  
// user.getProductById(6);

// await user.updateProduct(1, {description: "este es un producto modificado"});