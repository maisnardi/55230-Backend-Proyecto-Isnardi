//Controller de Loggers

export const GETLoggers = (req, res)=>{
    return res.status(200).json({
        message: "Logger HTTP",
        response: true
    })

}