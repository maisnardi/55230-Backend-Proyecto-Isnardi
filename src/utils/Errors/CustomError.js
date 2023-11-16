//Custom Error class

export default class CustomError {
    static new({ status, message, from }) {
        console.log("se activa el custom error");
        let error = new Error(message)
        error.status = status;
        error.message = message;
        error.from = from;
        throw error;
    }
};