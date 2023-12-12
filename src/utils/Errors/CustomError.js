//Custom Error class

export default class CustomError {
    
    static new ({ status, message, from }) {
        console.log("entro al custom error")
        console.log("status:",status)
        console.log("message:",message)
        console.log("from:",from)
        let error = new Error(message)
        error.status = status;
        error.message = message;
        error.from = from;
        throw error;
    }
};