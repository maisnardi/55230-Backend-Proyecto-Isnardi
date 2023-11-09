const NotFoundMiddleware = (req, res, next)=>{
    try {
        // return res.status(404).json({
        //     messege: req.method + req.url,
        // })
        const messege =  req.method + req.url;
        res.render('notFound',{messege:messege})
        
    } catch (error) {
        next(error);
    }
}

export default NotFoundMiddleware;