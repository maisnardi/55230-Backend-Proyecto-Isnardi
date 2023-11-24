//Controller de API Mocks
//Importaciones
import generateProduct from "../utils/genereateProducts.Faker.js"

//Controller de Mocking Products
export const GETMockingProducts = async (req, res)=>{
    let products=[]
    for (let index = 0; index < 100; index++) {
        products.push(generateProduct());
        
    }
    res.send({status: "success" , payload: products})
};