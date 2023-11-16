//Testing de modulo Products de Mocha

//Importación de módulos
import assert from "assert"
import ProductManager from "../../src/services/products.service.js"
import mongoose from "mongoose"

describe(
    "Testing Product module with mocha",
    function(){
        this.timeout(100000)
        before('connect', function(){
            const dbConnection = mongoose.connect('mongodb://usercoder:coder55230@ac-6o744vq-shard-00-00.9bmatez.mongodb.net:27017,ac-6o744vq-shard-00-01.9bmatez.mongodb.net:27017,ac-6o744vq-shard-00-02.9bmatez.mongodb.net:27017/ecommerce?ssl=true&replicaSet=atlas-55g89c-shard-0&authSource=admin&retryWrites=true&w=majority')
            dbConnection.then(()=>{console.log(`Conected to MongoDB database`)})
        })
        const productManager = new ProductManager()
        it(
            "Testing the creation of a product (Verify the existence of _id of the response.)",
            async()=>{
                const data = {
                    title: "Test mocha products",
                    description: "Mocha product",
                    price: 9999,
                    thumbnails: [],
                    code: "000-005",
                    stock: 999,
                    status: true,
                    category: "Test"
                }
                const response = await productManager.addProduct(data)
                console.log(response)
                //assert.ok(response.id)
            }
        )
        // it(
        //     "Testing the procurement of all products",
        //     async()=>{
        //         const response = await productManager.getProducts()
        //         console.log(response)
        //     }

        // )
    }
)

