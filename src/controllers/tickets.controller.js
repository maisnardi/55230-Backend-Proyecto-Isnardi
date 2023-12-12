//Controller de API Tickets
//Importaciones
import TicketManager from "../services/ticket.service.js";
import CartManager from "../services/cart.service.js";
import { el } from "@faker-js/faker";
import CustomError from "../utils/Errors/CustomError.js";
import errorsDictionary from "../utils/Errors/EnumErrors.js";


//Instanciamos un nuevo TicketManager.
const ticketManager = new TicketManager();

//Instanciamos un nuevo CartManager.
const cartManager = new CartManager();

//Controller POST purchase cart
export const POSTCreateTicket = async (req, res, next) => {
    try {
        console.log("Entro al controller POSTCreateTicket")
        let user = req.user;
        let cid = user.cartId.toString();
        const noStockProducts = await ticketManager.CreateTicket(cid, req.user.email, next);
        if (noStockProducts.message === "Cart is empty") {
            return CustomError.new(errorsDictionary.cartEmpty)
        }
        else if (noStockProducts.message === "Product out of stock") {
            res.status(200).json({ message: "Product out of stock" });
        } else if (noStockProducts.message === "Some products are out of stock") {
            await cartManager.updateCartArray(cid, noStockProducts.noStockArray)
            res.status(201).json({ message: "Ticket generated successfully, but some products are out of stock", ticket: noStockProducts.ticket });
        }
        else if (noStockProducts.message === "Ticket generated successfully") {
            await cartManager.updateCartArray(cid, noStockProducts.noStockArray)
            res.status(201).json({ message: "Ticket generated successfully", ticket: noStockProducts.ticket });
        }
        else {
            return CustomError.new(errorsDictionary.internalError)
        }
    } catch (error) {
        error.from = "controller"
        return next(error);
    }
}

//Controller GET calculate amount
export const GETCalculateAmount = async (req, res, next) => {
    try {
        let user = req.user;
        let cid = user.cartId.toString();
        const amount = await ticketManager.CalculateAmount(cid, next);
        if (amount.message === "Cart is empty") {
            return CustomError.new(errorsDictionary.cartEmpty)
        } else if (amount.message === "Product out of stock") {
            res.status(200).json({ message: "Product out of stock" });
        } else if (amount.message === "Total amount calculated successfully") {
            res.status(200).json({ message: "Total amount calculated successfully", totalAmount: amount.totalAmount, products: amount.products });
        } else {
            return CustomError.new(errorsDictionary.internalError)
        }
    } catch (error) {
        error.from = "controller"
        return next(error);
    }
}