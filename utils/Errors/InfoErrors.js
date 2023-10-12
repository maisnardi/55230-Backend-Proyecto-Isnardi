//Información de los errores generados

//Para produtos
export const generateProductErrorInfo = (product)=>{
    return `One or more properties were incomplete or not valid.
    List of required properties:
    *title       : needs to be a String, received ${ typeof product.title}
    *code        : needs to be a String, received ${ typeof product.code}
    *description :needs to be a String, received ${ typeof product.description}
    *thumbnails  : needs to be an Array of Strings, received ${ typeof product.thumbnails}
    *price       : needs to be a Number, received ${ typeof product.price}
    *category    : needs to be a String, received ${ typeof product.category}
    *stock       : needs to be a Number, received ${ typeof product.stock}
    *status      : needs to be Boolean, received ${ typeof product.status}
    `
}