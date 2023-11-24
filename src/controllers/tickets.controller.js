//Controller de API Tickets
//Importaciones
import TicketManager from "../services/ticket.service.js";
import CartManager from "../services/cart.service.js";
//Instanciamos un nuevo TicketManager.
const ticketManager = new TicketManager();

//Instanciamos un nuevo CartManager.
const cartManager = new CartManager();

//Controller POST purchase cart
export const POSTCreateTicket = async (req, res) => {
    try {
        console.log("entro en purchase")
        const { cid } = req.params;
        console.log(`El usuario es ${req.user.email}`)
        const noStockProducts = await cartManager.getTicket(cid, req.user.email);

        res.status(200).json({ product: noStockProducts });
    } catch (error) {
        console.log(error)
    }
}