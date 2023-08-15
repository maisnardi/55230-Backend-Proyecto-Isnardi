//Importacion de modulos
import CartModel from "../../models/cart.schema.js"    //Mongoose
import __dirname from "../../dirname.js";
import { ObjectId } from "mongodb";
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
            const cart = await CartModel.findById(id).populate("products._id");
            const result = cart? cart : false;
            return result.products;
        }catch(e){
            return error;
        }
    }

    //Función asíncrona que recibe como parametros un ID de un carrito y un ID de un producto, agrega el producto al carrito creando un objeto con el id del producto y la cantidad quantity inicializada en 1.Si el id del producto ya existia lo incrementa quantity en 1.Trabaja con persistencia en ATLAS.
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
                let carrito = await CartModel.find({_id:cartId}).populate("products._id")
                console.log(JSON.stringify(carrito))
                return true;
            } catch (error) {
                console.log(error)
            }
        }catch(error){
            console.log(error)
        }
    }
    
    //Función asíncrona que recibe como parametros un ID de un carrito y un ID de un producto, elimina del carrito el producto con el pid recibido. Trabaja con persistencia en ATLAS.
    deleteProduct = async (cartId,prodId)=>{
        try {
            const cart = await CartModel.findById(cartId);
            const indice = cart.products.findIndex(product => product._id.equals(prodId));
            cart.products.splice(indice, 1);
            cart.save();
            return true;
        } catch (error) {
            console.log(error)
        }
    }
    //Función asíncrona que recibe como parametros un ID de un carrito y un array de productos, actualiza el array completo de products de un carrito. Trabaja con persistencia en ATLAS.
    updateCartArray = async(cartId,productsArray)=>{
        try {
            const cart = await CartModel.findOneAndUpdate({ _id: cartId },{ products: productsArray });
            if(cart){
                return true;
            }
            else{
                return "Cart not found";
            }
        } catch (error) {
            console.log(error);
        }
    }
    //Función asíncrona que recibe como parametros un ID de un carrito, un ID de un producto y un valor de quantity, actualiza la cantidad quantity del producto dentro de un carrito. Trabaja con persistencia en ATLAS.
    updateCartQuantity = async(cartId,prodId,prodQuantity)=>{
        try {
            const cart = await CartModel.findById(cartId);
            if(cart){
                const index = cart.products.findIndex(element=>element._id.equals(prodId))
                if(index>0){
                    cart.products[index].quantity= prodQuantity.quantity;
                    cart.save();
                    return true;
                }else{
                    return "Product not found"
                }
                
            }else{
                return "Cart not found";
            }
            
        } catch (error) {
            console.log(error)
        }
    }
    //Función asíncrona que recibe como parametro un ID de un carrito y vacia el contenido del array products de dicho carrito. Trabaja con persistencia en ATLAS.
    deleteCartProducts = async(cartId)=>{
        try {
        const cart = await CartModel.findById(cartId);
        if(cart){
            cart.products=[];
            cart.save();
            return true
        }else{
            return "Cart not found" 
        }
        } catch (error) {
          console.log(error)  
        }
    }
}
export default CartManager;