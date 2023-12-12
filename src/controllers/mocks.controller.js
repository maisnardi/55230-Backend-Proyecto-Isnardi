//Controller de API Mocks
//Importaciones
import generateProduct from "../utils/genereateProducts.Faker.js"

//Controller de Mocking Products
export const GETMockingProducts = async (req, res, next)=>{
    try {
        let products=[]
        for (let index = 0; index < 100; index++) {
            products.push(generateProduct());
        }
        res.status(200).send({status: "success" , payload: products})
    } catch (error) {
        error.from = "controller"
        return next(error);
    }

};