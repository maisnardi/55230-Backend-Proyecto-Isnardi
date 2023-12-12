//DAO Tickets
import TicketModel from "../../models/ticket.schema.js";

class Ticket{

    //DAO Create ticket
    createTicketDAO = async (ticketData, next)=>{
        try {
            return await TicketModel.create(
                {
                    code:ticketData.code,
                    purchase_datetime:ticketData.purchase_datetime,
                    products:ticketData.products,
                    amount: ticketData.amount,
                    purchaser: ticketData.purchaser
                }
            )
        } catch (error) {
            error.from = "mongo"
            return next(error);
        }
        
    }
    //DAO Get ticket by id
    getTicketDAO = async (tid, next)=>{
        try {
            return await TicketModel.findById(tid).populate("products._id").lean();
        } catch (error) {
            error.from = "mongo"
            return next(error);
        }
    }

}
export default Ticket;