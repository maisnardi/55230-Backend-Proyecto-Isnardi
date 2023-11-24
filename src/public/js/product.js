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
        const response = await fetch(`/api/carts/${cid}/product/${pid}`, {
            method: 'POST',
        }).then((res)=>{
            if(res.status === 200)
            {
                window.location.href = `http://localhost:8080/carts/${cid}`
            }
            else{
                window.alert("Something went wrong try again")
                window.location.href = `http://localhost:8080/product/${pid}`
            }
        })

    } catch (error) { 
        console.log(error)
    }
});
