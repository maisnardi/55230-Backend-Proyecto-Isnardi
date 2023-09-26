//DAO Tickets
import TicketModel from "../../models/ticket.schema.js";

//DAO Create ticket
export const createTicket = async (ticketData)=>{
    console.log(ticketData)
    // return await TicketModel.create(
    //     {
    //         code:ticketData.code,
    //         purchase_datetime:ticketData.purchase_datetime,
    //         amount: ticketData.amount,
    //         purchaser: ticketData.purchaser
    //     }
    // )
}