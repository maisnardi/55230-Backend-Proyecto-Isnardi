//Generador de Productos con Faker,
import { fakerES_MX  as faker } from "@faker-js/faker";
import * as thumbnailsGenerator from "../utils/genereateProductsThumbnails.Faker.js"

const thumbnails=[]

for (let index = 0; index < 3; index++) {
    thumbnails.push(thumbnailsGenerator.generateThumbnails());
    
}

export default function generateProduct(){
    return{
        _id: faker.database.mongodbObjectId(),
        title:faker.commerce.product(),
        code:faker.string.numeric(3)+"-"+faker.string.numeric(4),
        description:faker.commerce.productDescription(),
        thumbnails,
        price: faker.commerce.price(),
        category:faker.commerce.productAdjective(),
        stock:faker.number.int({min:1, max:100}),
        status:"true",
    }
}