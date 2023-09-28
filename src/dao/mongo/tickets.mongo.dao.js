//DAO Tickets
import TicketModel from "../../models/ticket.schema.js";

class Ticket{

    //DAO Create ticket
    createTicket = async (ticketData)=>{
        console.log(ticketData)
        return await TicketModel.create(
            {
                code:ticketData.code,
                purchase_datetime:ticketData.purchase_datetime,
                amount: ticketData.amount,
                purchaser: ticketData.purchaser
            }
        )
    }
}
export default Ticket;