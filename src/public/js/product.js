//Formulario para agregar el producto al carrito

const form = document.getElementById("addProductToCart");
form.addEventListener('submit', async (event) => {
    event.preventDefault();
    const url = window.location.href;
    let pid = url.split('/').pop()
    const data = new FormData(form)
    const obj = {};
    data.forEach((value, key) => obj[key]=value);
    let cid = obj.cartId
    try {
        const response = await fetch(`/api/carts/${pid}`, {
            method: 'PUT',
        }).then((res)=>{
            console.log(res.status)
            if(res.status === 200)
            {
                window.location.href = `/carts`
            }
            else{
                window.alert("Something went wrong try again")
                window.location.href = `/product/${pid}`
            }
        })

    } catch (error) { 
        console.log(error)
    }
});


function redirectToProducts() {
    window.location.href = "/products"
}