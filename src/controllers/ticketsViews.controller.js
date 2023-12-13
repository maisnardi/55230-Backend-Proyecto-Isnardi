//Controller de Tickets view
//Importaciones
import TicketManager from "../services/ticket.service.js";
import CustomError from "../utils/Errors/CustomError.js";
import errorsDictionary from "../utils/Errors/EnumErrors.js";

//Instanciamos un nuevo TicketManager.
const ticketManager = new TicketManager();


//Controller GET ticket by id
export const GETTicketById = async (req, res, next) => {
    try {
        const { tid } = req.params;
        const data = await ticketManager.getTicketById(tid);
        if(data){
            const renderData = {
                data: data,
                display: req.display
            }
            return res.render('checkout', renderData)
        }else{
            return CustomError.new(errorsDictionary.notFoundTicket)
        }
    } catch (error) {
        error.from = "controller"
        return next(error);
    }
}
