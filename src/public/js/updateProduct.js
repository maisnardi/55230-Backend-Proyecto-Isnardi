//Delete button
//Formulario
let buttons = document.querySelectorAll(".delete-btn");
for (let i = 0; i < buttons.length; i++) {
    buttons[i].addEventListener("click", async function () {
        try {
            const response = await fetch(`/api/products/${this.id}`, {
                method: 'DELETE',
            })
                .then((res) => {
                    if (res.status === 200) {
                        alert("Product deleted")
                        window.location.href = "/products/update"
                    }
                    else {
                        window.alert("Invalid credentials, please check them");
                        window.location.href = "/products/update"
                    }
                })
        } catch (error) {
            console.log(error)
        }
    });
}

//Update
//Formulario
const formUpdate = document.getElementById("updateForm");
formUpdate.addEventListener('submit', async (event) => {
    event.preventDefault();
    let id;
    let data;
    let obj = {};
    let elementoActivo = document.querySelector('input[name="productId"]:checked');
    if (elementoActivo) {
        id = elementoActivo.value;
        data = new FormData(formUpdate);
        data.forEach((value, key) => obj[key] = value);
        console.log("obj", JSON.stringify(obj));
        console.log(id);
        try {
            const response = await fetch(`/api/products/${id}`, {
                method: 'PUT',
                body: data,
            }).then((res) => {
                console.log(res)
                if (res.status === 200) {
                    window.alert("Product updated successfully.")
                    window.location.href = "/products/update";
                }
                else {
                    alert("Error");
                }
            })

        } catch (error) {
            console.log(error)
        }
    } else {
        alert('Please select the product you want to update and then try again');
    }
});



