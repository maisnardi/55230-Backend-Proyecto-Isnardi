import EErrors from "./Errors/EnumErrors.js"

const ErrorHandlerMiddleware = (error, req, res, next)=>{
    console.log("entro al middleware de erroes")
    //console.log(error.cause)
    
    switch(error.code){
        case EErrors.USER_INPUT_ERROR:
            res.send({error:true, msg: error.name})
            break;
        default:
            res.send({error:true, msg: "unhandled error/promise"})
            break;
           
    }
}

export default ErrorHandlerMiddleware;