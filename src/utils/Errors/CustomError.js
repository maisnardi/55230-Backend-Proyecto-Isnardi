//Custom error class

// export default class CustomError {
//     static createError({ message, cause, name= "Error", code=1 }){

//         const newError = new Error(message, { cause })
//         newError.name = name
//         newError.code = code
//         throw newError;
//     }
// }

export default class CustomError {
    static new({ status, message, from }) {
        let error = new Error(message)
        error.status = status;
        error.message = message;
        error.from = from;
        throw error;
    }
};