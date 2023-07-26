//Importacion de modulos
//import { error } from "console";
import fs from "fs";    //FileSystem
import __dirname from "./dirname.js";
//Declaracion de clase CartManager
class CartManager{
    //declaro el constructor
    constructor(path){
        this.carts=[];
        this.path=`${__dirname}/db/${path}.json`;
    }

    //Función privada y asincrona de utilidad para guardar en archivo
    #writeFile = async(carts)=>{
        await fs.promises.writeFile(this.path,JSON.stringify(carts));
    }
    //Función asíncrona que al ser llamada crea un array de carritos, con un objeto con id único y un array de productos. Trabaja con presistencia de archivo.
    createCart = async ()=>{    
        let newCart;
        try {
            this.carts = JSON.parse(await fs.promises.readFile(this.path,"utf-8"));
            newCart= {
                id:this.carts.length == 0 ? 1 : this.carts[this.carts.length - 1].id + 1,
                products:[]
            }
            this.carts.push(newCart);
            this.#writeFile(this.carts);
        } catch (error) {
            console.log("La DB de carritos no existe");
            try {
                this.carts=[{id:1,products:[]}];
                await this.#writeFile(this.carts);
                console.log("el carrito fue creado");
            } catch (error) {
                console.log(`No se pudo crear la DB ${error}`);
            }
        }
        return this.carts;
    }

    //Función asíncrona que recibe el ID de un carrito y devuelve el contenido del array de productos en el.Trabaja con persistencia de archivo.
    getCartProductsById = async (id)=>{
        try{
            const data = JSON.parse(await fs.promises.readFile(this.path,"utf-8"));
            const cart = data.find(element => element.id===id);
            const result = cart?  cart : false;
            return result;
        }catch(e){
            return error;
        }
    }

    //Función asíncrona que recibe como parametros el ID de un carrito y ID de un producto, agrega el producto al carrito creando un objeto con el id del producto y la cantidad quantity inicializada en 1.Si el id del producto ya existia lo incrementa quantity en 1.Trabaja con persistencia de archivo.
    addProductToCart = async (cartId,prodId)=>{
        try {
            const data = JSON.parse(await fs.promises.readFile(this.path,"utf-8"));
            const cartIndex = data.findIndex(element=> element.id===cartId);
            if(cartIndex>=0){
                const prodIndex = data[cartIndex].products.findIndex(element=> element.id===prodId)
                if(prodIndex<0)
                {
                    data[cartIndex].products.push({'id':prodId, 'quantity':1});
                }
                else{
                    data[cartIndex].products[prodIndex].quantity++;
                }
                this.#writeFile(data);
                return true;
            }            
        } catch (error) {
            console.log(error)
        }
    }   
}
export default CartManager;


//Testing
//const cartManager = new CartManager("carts");
//cartManager.createCart();
//cartManager.getCartProductsById(3);
//cartManager.addProductToCart(1,2);