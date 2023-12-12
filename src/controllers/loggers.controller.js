//Controller de Loggers

export const GETLoggers = (req, res, next)=>{
    try {
        return res.status(200).json({
            message: "Logger HTTP",
            response: true
        })
    } catch (error) {
        error.from = "controller"
        return next(error);
    }
}