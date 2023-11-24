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
            return alert("Error: product not created");
        }
        window.location.href = "http://localhost:8080/home";    
    } catch (error) { 
        console.log(error)
    }
});
