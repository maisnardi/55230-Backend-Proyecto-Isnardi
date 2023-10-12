//Custom error class
 
export default class CustomError {
    static createError({ message, cause, name= "Error", code=1 }){
        
        const newError = new Error(message, { cause })
        newError.name = name
        newError.code = code
        throw newError;
    }
}
