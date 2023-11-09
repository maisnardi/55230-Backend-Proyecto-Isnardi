//Importacion de modulos
//import Ticket from "../dao/mongo/tickets.mongo.dao.js"
import { TicketsDAO } from "../dao/factory.js";

//Instanciamos la clase ticket
const TicketDAO = new TicketsDAO();

class TicketManager{
    constructor(){
    }
    createTicket = async (amount, email)=>{
        const date = new Date().toUTCString();
        const code = date[15]+date[23]+date[18]+date[24]+date[5]+date[6]+date[8]+date[20]+date[17]+date[0]+date[14]+date[21];
        const ticketData = {
            code: code ,
            purchase_datetime: date,
            amount: amount,
            purchaser: email,
        }
        try {
            await TicketDAO.createTicketDAO(ticketData);
            console.log("guardado")
        } catch (error) {
            console.log(error)
        }
    }
}
export default TicketManager;