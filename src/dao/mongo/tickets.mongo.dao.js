//DAO Tickets
import TicketModel from "../../models/ticket.schema.js";

class Ticket{

    //DAO Create ticket
    createTicketDAO = async (ticketData)=>{
        return await TicketModel.create(
            {
                code:ticketData.code,
                purchase_datetime:ticketData.purchase_datetime,
                amount: ticketData.amount,
                purchaser: ticketData.purchaser
            }
        )
    }

    //DAO Get ticket
    // getTicketDAO = async(ticketID)

}
export default Ticket;