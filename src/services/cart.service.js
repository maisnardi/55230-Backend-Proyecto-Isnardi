//Importacion de modulos
// import CartModel from "../../models/cart.schema.js"    //Mongoose
import __dirname from "../dirname.js";
// import Cart from "../dao/mongo/cart.mongo.dao.js"
// import Product  from "../dao/mongo/products.mongo.js"
import ProductManager from "./products.service.js";

import { CartsDAO, ProductsDAO } from "../dao/factory.js";
import TicketManager from "./ticket.service.js";


//Instanciación de DAOs
//Instanciamos la clase Cart
const CartDAO = new CartsDAO();

//Instanciamos la clase Product
const ProductDAO = new ProductsDAO();


//Instanciación de Managers
//Instanciamos un nuevo productManager.
const productManager = new ProductManager("products");

//Instanciamos un nuevo ticketManager.
const ticketManager = new TicketManager();

//Declaracion de clase CartManager
class CartManager {
    //declaro el constructor
    constructor() {
    }

    //Función asíncrona que al ser llamada crea un array de carritos, con un objeto con id único y un array de productos. Trabaja con presistencia de archivo.
    createCart = async (next) => {
        const products = [];
        let cart;
        try {
            cart = await CartDAO.insertProducts(products, next);
            if (cart) return cart._id;
        } catch (error) {
            error.from = "service";
            return next(error);
        }
    }

    //Función asíncrona que recibe el ID de un carrito y devuelve el contenido del array de productos en el.Trabaja con persistencia en ATLAS.
    getCartProductsById = async (id, next) => {
        try {
            //const cart = await CartModel.findById(id).populate("products._id");
            const cart = await CartDAO.findCartById(id, next);
            const result = cart ? cart : false;
            return result.products;
        } catch (error) {
            error.from = "service";
            return next(error);
        }
    }

    // //Función asíncrona que recibe el ID de un carrito y querys y devuelve el contenido del array de productos paginado.Trabaja con persistencia en ATLAS.
    // getCartProductsByIdpaginate = async (id,next) => {
    //     try {
    //         const cart = await CartDAO.findCartByIdPaginate(id, next);
    //         const result = cart ? cart : false;
    //         return result.products;
    //     } catch (error) {
    //         error.from = "service";
    //         return next(error);
    //     }
    // }

    //Función asíncrona que recibe como parametros un ID de un carrito y un ID de un producto, agrega el producto al carrito creando un objeto con el id del producto y la cantidad quantity inicializada en 1.Si el id del producto ya existia lo incrementa quantity en 1.Trabaja con persistencia en ATLAS.
    addProductToCart = async (cartId, prodId, next) => {
        try {
            //const cart = await CartModel.findById(cartId);
            const product = await ProductDAO.findById(prodId, next);
            if (product == null) {
                return { message: "Product not found" };
            }
            else {
                const cart = await CartDAO.findCartById(cartId, next);
                if (!cart) {
                    return { message: "Cart not found" };
                } else {
                    const indice = cart.products.findIndex(product => product._id.equals(prodId));
                    if (indice >= 0) {
                        cart.products[indice].quantity += 1;
                    }
                    else {
                        cart.products.push({ _id: prodId, "quantity": 1 });
                    }
                    try {
                        await cart.save();
                        await CartDAO.findCartById(cartId, next);
                        return { message: "updated" };
                    } catch (error) {
                        error.from = "service";
                        next(error);
                    }
                }
            }
        } catch (error) {
            error.from = "service";
            next(error);
        }
    }

    //Función asíncrona que recibe como parametros un ID de un carrito y un ID de un producto, elimina del carrito el producto con el pid recibido. Trabaja con persistencia en ATLAS.
    deleteProduct = async (cartId, prodId, next) => {
        try {
            console.log("entro en delete product service")
            const product = await ProductDAO.findById(prodId, next);
            if (product == null) {
                return { message: "Product not found" };
            }
            else {
                //const cart = await CartModel.findById(cartId).populate("products._id");
                const cart = await CartDAO.findCartById(cartId, next);
                if (cart == null) {
                    return { message: "Cart not found" };
                } else {
                    const indice = cart.products.findIndex(product => product._id.equals(prodId));
                    cart.products.splice(indice, 1);
                    cart.save();
                    return { message: "deleted" };
                }
            }
        } catch (error) {
            error.from = "service";
            next(error);
        }
    }
    //Función asíncrona que recibe como parametros un ID de un carrito y un array de productos, actualiza el array completo de products de un carrito. Trabaja con persistencia en ATLAS.
    updateCartArray = async (cartId, productsArray, next) => {
        try {
            //const cart = await CartModel.findOneAndUpdate({ _id: cartId },{ products: productsArray });
            const cart = await CartDAO.updateCartProducts(cartId, productsArray, next);
            console.log(cart)
            if (cart) {
                return {message: "updated"};
            }
            else {
                return {message: "Cart not found"};
            }
        } catch (error) {
            error.from = "service";
            next(error);
        }
    }
    //Función asíncrona que recibe como parametros un ID de un carrito, un ID de un producto y un valor de quantity, actualiza la cantidad quantity del producto dentro de un carrito. Trabaja con persistencia en ATLAS.
    updateCartQuantity = async (cartId, prodId, prodQuantity, next) => {
        try {
            //const cart = await CartModel.findById(cartId);
            const cart = await CartDAO.findCartById(cartId, next);
            if (cart) {
                const index = cart.products.findIndex(element => element._id.equals(prodId))
                if (index > 0) {
                    cart.products[index].quantity = prodQuantity.quantity;
                    cart.save();
                    return { message: "updated" };
                } else {
                    return {message: "Product not found"}
                }

            } else {
                return {message: "Cart not found"};
            }
        } catch (error) {
            error.from = "service";
            next(error);
        }
    }
    //Función asíncrona que recibe como parametro un ID de un carrito y vacia el contenido del array products de dicho carrito. Trabaja con persistencia en ATLAS.
    deleteCartProducts = async (cartId, next) => {
        try {
            const cart = await CartDAO.findCartById(cartId, next);
            if (cart) {
                cart.products = [];
                cart.save();
                return true
            } else {
                return "Cart not found"
            }
        } catch (error) {
            error.from = "service";
            next(error);
        }
    }
    // //Función asíncrona que recibe como parametro un ID de un carrito, verifica el stock de los productos, hace la carga en atlas y devuelve un array con los productos que no se pudieron cargar por falta de stock. Trabaja con persistencia en ATLAS.
    // CreateTicket = async (cartId, email) => {
    //     try {
    //         let totalAmount = 0;
    //         const partialAmount = []
    //         let response;
    //         let message = "Ticket generated successfully"
    //         const cart = await CartDAO.findCartById(cartId);
    //         if (cart.products.length == 0) {

    //             return response = {
    //                 message: "Cart is empty",
    //                 noStockArray: []
    //             }
    //         } else {
    //             const stockArray = cart.products.filter(item => item._id.stock >= item.quantity);
    //             if (stockArray.length == 0) {
    //                 return response = {
    //                     message: "Product out of stock",
    //                     noStockArray: cart
    //                 }
    //             } else {
    //                 stockArray.forEach(element => {
    //                     partialAmount.push(element.quantity * element._id.price)
    //                 });
    //                 totalAmount = partialAmount.reduce((initialValue, currentValue, index, array) => { return initialValue + currentValue })
    //                 const noStockArray = cart.products.filter(item => item._id.stock < item.quantity);
    //                 if(noStockArray.length > 0){
    //                     message = "Some products are out of stock"
    //                 }
    //                 //Actualizo el stock en la BD
    //                 cart.products.forEach(async element => {
    //                     try {
    //                         const product = await ProductDAO.findById(element._id);
    //                         if (element.quantity <= product.stock) {
    //                             product.stock -= element.quantity;
    //                             await productManager.updateProduct(element._id, product)
    //                         }
    //                     } catch (error) {
    //                         console.log(error)
    //                     }
    //                 })
    //                 const ticketProducts = []
    //                 stockArray.forEach(element => {
    //                     ticketProducts.push(
    //                         {
    //                             _id: element._id._id.toString(),
    //                             quantity: element.quantity 
    //                         })
    //                 });
    //                 const ticketData = await ticketManager.createTicket(totalAmount, email, ticketProducts)
    //                 response = {
    //                     message: message,
    //                     ticket: ticketData,
    //                     noStockArray: noStockArray
    //                 }
    //                 return response;
    //             }
    //         }
    //     } catch (error) {
    //         console.log(error)
    //     }
    // }
    // //Función asíncrona que recibe como parametro un ID de un carrito y devuelve el total a pagar. Trabaja con persistencia en ATLAS.
    // CalculateAmount = async (cartId) => {
    //     try {
    //         let totalAmount = 0;
    //         const partialAmount = []
    //         const cart = await CartDAO.findCartById(cartId);
    //         if (cart.products.length == 0) {
    //             return "Cart is empty"
    //         } else {
    //             const stockArray = cart.products.filter(item => item._id.stock >= item.quantity);
    //             if (stockArray.length == 0) {
    //                 return "Product out of stock"
    //             } else {
    //                 stockArray.forEach(element => {
    //                     partialAmount.push(element.quantity * element._id.price)
    //                 });
    //                 totalAmount = partialAmount.reduce((initialValue, currentValue, index, array) => { return initialValue + currentValue })
    //                 const cartAmount = {
    //                     totalAmount:totalAmount,
    //                     products:stockArray
    //                 }
    //                 return cartAmount;
    //             }
    //         }
    //     } catch (error) {
    //       error.from = "service";
            //next(error);
    //     }
    // }
}
export default CartManager;