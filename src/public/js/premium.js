//Formulario para que un usuario se haga premium

const form = document.getElementById("premiumForm");
form.addEventListener('submit', async (event) => {
    event.preventDefault();
    try {
        const response = await fetch(`/api/auth/prem`, {
            method: 'PUT',
            headers: {
                "Content-Type": "application/json",
            },
        });
        const responseData = await response.json();
        console.log(responseData)
        if(responseData.error === false)
        {
            window.alert("You are now a premium user")
            window.location.href = `/`
        }else{
            window.alert(responseData.message)
        }
    } catch (error) { 
        console.log(error)
    }
});
