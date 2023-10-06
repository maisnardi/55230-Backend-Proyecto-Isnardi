//Generador de Productos con Faker,
import { fakerES_MX  as faker} from "@faker-js/faker";


export function generateThumbnails(){
    return faker.image.url(640,480)
}
