//Declaracion de clase ProductManager
class ProductManager{
    //declaro el constructor
    constructor(){
        this.products=[];
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

    //Función que recibe un producto, tras realizar unas verificaciones lo carga dentro del array products con un número de ID único.
    addProduct = (product)=>{
        let data=this.#modelData(product)  
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
                console.log("El producto fue cargado");
            }
        }else{
            console.log("Campos incompletos, por favor revíselos");
        }
    }

    //Función que devuelve por consola todos los productos cargados en el Array products.
    getProducts = ()=>{
        console.log("Lista de productos:")
        console.log(this.products);
    }

    //Función que recibe como parametro un ID de un producto y lo busca dentro del array products. Si existe devuelve por consola el producto, si no arroja un mensaje indicando que el productno no existe.
    getProductById = (id)=>{
        const product= this.products.find(element => element.id===id)
        product ? console.log(`Producto encontrado: \n ${JSON.stringify(product,null,2)}`) : console.log(`ERROR: Not found ID: ${id}`);
    }
}


//Testing
const user = new ProductManager();
user.getProducts();
user.addProduct({title: "producto prueba",
    description:"Este es un producto prueba",
    price:200,
    thumbnail:"Sin imagen",
    code:"abc123",
    stock:25})

user.getProducts();

user.addProduct({title: "producto prueba",
    description:"Este es un producto prueba",
    price:200,
    thumbnail:"Sin imagen",
    code:"abc123",
    stock:25})

user.getProductById(1);  
user.getProductById(2);

