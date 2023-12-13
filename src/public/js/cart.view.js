//Remove
//Boton para eliminar un producto de un carrito.

let removeBtn = document.querySelectorAll(".remove-btn");
console.log(removeBtn)
for (let i = 0; i < removeBtn.length; i++) {
    removeBtn[i].addEventListener("click", async function () {
        try {
            const response = await fetch(`/api/carts/${this.id}`, {
                method: 'DELETE',
            }).then((res) => {
                if (res.status === 200) {
                    window.location.href = `/carts`
                }
                else {
                    window.alert("Something went wrong try again")
                    window.location.href = `/carts`
                }
            })
        } catch (error) {
            console.log(error)
        }
    });
}

//Delete
//Formulario para eliminar todos los productos del carrito.
const deleteCart = document.getElementById("empty");
deleteCart.addEventListener('submit', async (event) => {
    event.preventDefault();
    const data = new FormData(deleteCart)
    const obj = {};
    data.forEach((value, key) => obj[key] = value);
    let cid = obj.cid
    try {
        const response = await fetch(`/api/carts/`, {
            method: 'DELETE',
        }).then((res) => {
            console.log(res);
            if (res.status === 200) {
                window.location.href = `/carts/`
            }
            else {
                window.alert("Something went wrong try again")
                window.location.href = `/carts/`
            }
        })

    } catch (error) {
        console.log(error)
    }
});

//Continue to checkout
//Formulario para generar el ticket.
const ticket = document.getElementById("ticket");
ticket.addEventListener('submit', async (event) => {
    event.preventDefault();
    try {
        const response = await fetch(`/api/tickets`, {
            method: 'POST',
        })
            .then(async (res) => {
                const response = await res.json()
                if (res.status === 201) {
                    window.alert(response.message)
                    window.location.href = `/tickets/${response.ticket._id}`
                }else if(200){
                    window.alert(response.message)
                    window.location.href = `/carts`
                }
                else if (res.status === 404) {
                    window.alert(response.message)
                    window.location.href = `/carts`
                }
                else {
                    window.alert("Something went wrong try again")
                    window.location.href = `/carts`
                }
            })
    } catch (error) {
        console.log(error)
    }
});