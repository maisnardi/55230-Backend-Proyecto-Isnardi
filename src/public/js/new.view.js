//Formulario
const form = document.getElementById("newProdForm");

form.addEventListener('submit', async (event) => {
    event.preventDefault();
    const data = new FormData(form)
    try {
        const response = await fetch('/api/products', {
            method: 'POST',
            body: data
        });
        const responseData = await response.json();

        if (responseData.error) {
            return alert(responseData.error);
        }
        alert("Product created successfully")
        window.location.href = "/new";    
    } catch (error) { 
        console.log(error)
    }
});
