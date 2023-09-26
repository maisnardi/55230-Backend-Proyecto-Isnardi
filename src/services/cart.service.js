//Importacion de modulos
// import CartModel from "../../models/cart.schema.js"    //Mongoose
import __dirname from "../dirname.js";
import * as CartDAO from "../dao/mongo/cart.mongo.dao.js"
import * as ProductDAO from "../dao/mongo/products.mongo.js"
import ProductManager from "./products.service.js";
import TicketManager from "./ticket.service.js";

//Instanciamos un nuevo productManager.
const productManager = new ProductManager("products");
const ticketManger = new TicketManager();
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
            //await CartModel.insertMany({products});
            await CartDAO.insertProducts(products);
            //carts = await CartModel.find().populate("products._id");
            carts = await CartDAO.findAllCarts();
        } catch (error) {
            console.log(error)
        }
        return carts;  
    }

    //Función asíncrona que recibe el ID de un carrito y devuelve el contenido del array de productos en el.Trabaja con persistencia en ATLAS.
    getCartProductsById = async (id)=>{
        try{
            //const cart = await CartModel.findById(id).populate("products._id");
            const cart = await CartDAO.findCartById(id);
            const result = cart? cart : false;
            return result.products;
        }catch(e){
            return error;
        }
    }

    //Función asíncrona que recibe como parametros un ID de un carrito y un ID de un producto, agrega el producto al carrito creando un objeto con el id del producto y la cantidad quantity inicializada en 1.Si el id del producto ya existia lo incrementa quantity en 1.Trabaja con persistencia en ATLAS.
    addProductToCart = async (cartId,prodId)=>{
        try {
            //const cart = await CartModel.findById(cartId);
            const cart = await CartDAO.findCartById(cartId);
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
                //let carrito = await CartModel.find({_id:cartId}).populate("products._id")
                let carrito = await CartDAO.findCartById(cartId);
                //console.log(JSON.stringify(carrito))
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
            //const cart = await CartModel.findById(cartId).populate("products._id");
            const cart = await CartDAO.findCartById(cartId);
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
            //const cart = await CartModel.findOneAndUpdate({ _id: cartId },{ products: productsArray });
            const cart = await CartDAO.updateCartProducts(cartId,productsArray);
            console.log(cart)
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
            //const cart = await CartModel.findById(cartId);
            const cart = await CartDAO.findCartById(cartId);
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
            //const cart = await CartModel.findById(cartId);
            const cart = await CartDAO.findCartById(cartId);
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
    //Función asíncrona que recibe como parametro un ID de un carrito, verifica el stock de los productos, hace la carga en atlas y devuelve un array con los productos que no se pudieron cargar por falta de stock. Trabaja con persistencia en ATLAS.
    purchaseCart = async (cartId) =>{
        let noStockArray = [];
        let amount = 0;
        try {
            const cart = await CartDAO.findCartById(cartId);
            cart.products.forEach( async element=>{
                try {
                    const product = await ProductDAO.findById(element._id);
                    if(element.quantity<=product.stock)
                    {
                        product.stock -= element.quantity;
                        await productManager.updateProduct(element._id, product)
                        const amount =amount +element._id.price*element.quantity;
                    }else{
                        console.log("no hay stock suficiente")
                        noStockArray.push({_id:element._id, quantity:element.quantity})
                    }
                } catch (error) {
                    console.log(error)
                }
            })
            
        }catch (error) {
           console.log(error)  
        }
        //console.log(amount)
        await ticketManger.createTicket(amount);
        return noStockArray;   
    }
}
export default CartManager;