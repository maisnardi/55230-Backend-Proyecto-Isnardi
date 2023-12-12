import logger from "../config/loggers/factory.js";

export default (req,res,next)=>{
    req.logger = logger;
    req.logger.HTTP(`${req.method} ${req.url} - ${new Date().toLocaleTimeString()}`);
    return next();
}