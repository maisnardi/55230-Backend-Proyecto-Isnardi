//Importacion de modulos
import CartModel from "../../models/cart.schema.js"    //Mongoose
import __dirname from "../../dirname.js";

//Declaracion de clase CartManager
class CartManager{
    //declaro el constructor
    constructor(){
    }

    //Función asíncrona que al ser llamada crea un array de carritos, con un objeto con id único y un array de productos. Trabaja con presistencia de archivo.
    createCart = async ()=>{
        const products = [];
        let carts;
        try {
            await CartModel.insertMany({products});
            carts = await CartModel.find();
        } catch (error) {
            console.log(error)
        }
        return carts;  
    }

    //Función asíncrona que recibe el ID de un carrito y devuelve el contenido del array de productos en el.Trabaja con persistencia en ATLAS.
    getCartProductsById = async (id)=>{
        try{
            const cart = await CartModel.findById(id);
            const result = cart?  cart : false;
            return result.products;
        }catch(e){
            return error;
        }
    }

    //Función asíncrona que recibe como parametros el ID de un carrito y ID de un producto, agrega el producto al carrito creando un objeto con el id del producto y la cantidad quantity inicializada en 1.Si el id del producto ya existia lo incrementa quantity en 1.Trabaja con persistencia en ATLAS.
    addProductToCart = async (cartId,prodId)=>{
        try {
            const cart = await CartModel.findById(cartId);
            const indice = cart.products.findIndex(product => product._id.equals(prodId));
            if(indice>=0)
            {
                cart.products[indice].quantity += 1;
            }
            else{
                cart.products.push({_id:prodId, "quantity":1});
            }
            try {
                await cart.save();
                return true;
            } catch (error) {
                console.log(error)
            }
        }catch(error){
            console.log(error)
        }
    }              
}
export default CartManager;