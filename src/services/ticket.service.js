//Importacion de modulos
//import Ticket from "../dao/mongo/tickets.mongo.dao.js"

import { TicketsDAO , ProductsDAO , CartsDAO} from "../dao/factory.js";
import ProductManager from "./products.service.js";

//Instanciamos la clase product
const ProductDAO = new ProductsDAO();
//Instanciamos la clase product
const CartDAO = new CartsDAO();
//Instanciamos la clase ticket
const TicketDAO = new TicketsDAO();

const productManager = new ProductManager();

class TicketManager {
    constructor() {
    }
    //Función asíncrona que recibe como parametro los datos del ticket, lo crea y lo carga en atlas. Trabaja con persistencia en ATLAS.
    createTicket = async (amount, email, products, next) => {
        const date = new Date().toUTCString();
        const code = date[15] + date[23] + date[18] + date[24] + date[5] + date[6] + date[8] + date[20] + date[17] + date[0] + date[14] + date[21];
        const ticketData = {
            code: code,
            purchase_datetime: date,
            products: products,
            amount: amount,
            purchaser: email,
        }
        try {
            const response = await TicketDAO.createTicketDAO(ticketData, next);
            return response;
        } catch (error) {
            error.from = "service"
            return next(error);
        }
    }
    //Función asíncrona que recibe como parametro un ID de un ticket y lo busca en atlas. Trabaja con persistencia en ATLAS.
    getTicketById = async (tid, next) => {
        try {
            return await TicketDAO.getTicketDAO(tid, next);
        } catch (error) {
            error.from = "service"
            return next(error);
        }
    }

    //Función asíncrona que recibe como parametro un ID de un carrito, verifica el stock de los productos, hace la carga en atlas y devuelve un array con los productos que no se pudieron cargar por falta de stock. Trabaja con persistencia en ATLAS.
    CreateTicket = async (cartId, email, next) => {
        try {
            let totalAmount = 0;
            const partialAmount = []
            let response;
            let message = "Ticket generated successfully"
            const cart = await CartDAO.findCartById(cartId, next);
            if (cart.products.length == 0) {
                
                return response = {
                    message: "Cart is empty",
                    noStockArray: []
                }
            } else {
                const stockArray = cart.products.filter(item => item._id.stock >= item.quantity);
                if (stockArray.length == 0) {
                    return response = {
                        message: "Product out of stock",
                        noStockArray: cart
                    }
                } else {
                    stockArray.forEach(element => {
                        partialAmount.push(element.quantity * element._id.price)
                    });
                    totalAmount = partialAmount.reduce((initialValue, currentValue, index, array) => { return initialValue + currentValue })
                    const noStockArray = cart.products.filter(item => item._id.stock < item.quantity);
                    if(noStockArray.length > 0){
                        message = "Some products are out of stock"
                    }
                    //Actualizo el stock en la BD
                    cart.products.forEach(async element => {
                        try {
                            const product = await ProductDAO.findById(element._id, next);
                            if (element.quantity <= product.stock) {
                                product.stock -= element.quantity;
                                await productManager.updateProduct(element._id, product, next)
                            }
                        } catch (error) {
                            error.from = "service"
                            return next(error);
                        }
                    })
                    const ticketProducts = []
                    stockArray.forEach(element => {
                        ticketProducts.push(
                            {
                                _id: element._id._id.toString(),
                                quantity: element.quantity 
                            })
                    });
                    const ticketData = await this.createTicket(totalAmount, email, ticketProducts, next)
                    response = {
                        message: message,
                        ticket: ticketData,
                        noStockArray: noStockArray
                    }
                    return response;
                }
            }
        } catch (error) {
            error.from = "service"
            return next(error);
        }
    }
    //Función asíncrona que recibe como parametro un ID de un carrito y devuelve el total a pagar. Trabaja con persistencia en ATLAS.
    CalculateAmount = async (cartId, next) => {
        try {
            let totalAmount = 0;
            const partialAmount = [];
            let products = [];
            const cart = await CartDAO.findCartById(cartId, next);
            if (cart.products.length == 0) {
                return {message:"Cart is empty"}
            } else {
                const stockArray = cart.products.filter(item => item._id.stock >= item.quantity);
                if (stockArray.length == 0) {
                    return {message:"Product out of stock"}
                } else {
                    stockArray.forEach(element => {
                        partialAmount.push(element.quantity * element._id.price)
                        products.push({productID:element._id._id, quantity:element.quantity})
                    });
                    totalAmount = partialAmount.reduce((initialValue, currentValue, index, array) => { return initialValue + currentValue })
                    const cartAmount = {
                        message: "Total amount calculated successfully",
                        totalAmount:totalAmount,
                        products:products
                    }
                    return cartAmount;
                }
            }
        } catch (error) {
            error.from = "service"
            return next(error);
        }
    }
}



export default TicketManager;