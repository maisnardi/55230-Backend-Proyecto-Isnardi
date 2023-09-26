//Importacion de modulos
import * as TicketDAO from "../dao/mongo/tickets.mongo.dao.js"

class TicketManager{
    constructor(){
        this.amount=0;
    }

    createTicket = async (stockArray)=>{
        console.log(stockArray)
    //     const date = new Date().toUTCString();
    //     const code = date[15]+date[23]+date[18]+date[24]+date[5]+date[6]+date[8]+date[20]+date[17]+date[0]+date[14]+date[21];
    //     const ticketData = {
    //         code: code ,
    //         purchase_datetime: date,
    //         amount: amount,
    //         purchaser: "Test",
    //     }
    //     TicketDAO.createTicket(ticketData);
     }
}
export default TicketManager;