//Formulario para eliminar un producto de un carrito.


const form = document.getElementById("removebtn");
form.addEventListener('submit', async (event) => {
    event.preventDefault();
    const url = window.location.href;
    let cid = url.split('/').pop()
    const data = new FormData(form)
    const obj = {};
    data.forEach((value, key) => obj[key]=value);
    try {
        const response = await fetch(`/api/carts/${cid}/product/${obj.pid}`, {
            method: 'DELETE',
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

//Formulario para eliminar todos los productos del carrito.
const deleteCart = document.getElementById("empty");
deleteCart.addEventListener('submit', async (event) => {
    event.preventDefault();
    
    const data = new FormData(deleteCart)
    const obj = {};
    data.forEach((value, key) => obj[key]=value);
    let cid = obj.cid
    console.log(obj)
    try {
        const response = await fetch(`/api/carts/${cid}`, {
            method: 'DELETE',
        }).then((res)=>{
            console.log(res);
            if(res.status === 200)
            {
                window.location.href = `http://localhost:8080/carts/${cid}`
            }
            else{
                window.alert("Something went wrong try again")
                window.location.href = `http://localhost:8080/carts/${cid}`
            }
        })

    } catch (error) { 
        console.log(error)
    }
});