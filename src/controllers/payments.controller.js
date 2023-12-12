//Controller de Payments

//Importaciones
import { ENV } from "../config/config.js";
import CustomError from "../utils/Errors/CustomError.js";
import errorsDictionary from "../utils/Errors/EnumErrors.js";

// SDK de Mercado Pago
import { MercadoPagoConfig, Preference } from 'mercadopago';
// Agrega credenciales
const client = new MercadoPagoConfig({ accessToken: ENV.MP_ACCESS_TOKEN });

//Controller POST de Payments
export const POSTPayment = async (req, res, next) => {
    try {
        const body = {
            items: [{
                title: req.body.title,
                quantity: Number(req.body.quantity),
                unit_price: Number(req.body.price),
                currency_id: 'ARS',
            }],
            //Rutas de redireccionamiento, No es posible utilizar localhost
            back_urls: {
                success: 'youtube.com',
                failure: 'ole.com.ar',
                pending: 'google.com',
            },
            auto_return: 'approved',
        };
        const preference = new Preference(client);
        const result = await preference.create({ body });
        if(result){
            res.json({ id: result.id });
        }
        else{
            return CustomError.new(errorsDictionary.errorPayment)
        }
    } catch (error) {
        error.from = "controller";
        return next(error);
    }
}