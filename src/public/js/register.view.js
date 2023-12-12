//Formulario register
const form = document.getElementById("registerForm");

form.addEventListener('submit', async (event) => {
    event.preventDefault();
    const data = new FormData(form)
    const obj = {};
    data.forEach((value, key) => obj[key]=value);
    try {
        const response = await fetch('/api/auth/register', {
            method: 'POST',
            body: JSON.stringify(obj),
            headers: {
                "Content-Type": "application/json",
            },
        })
            .then((res)=>{
                console.log(res.status);
                if(res.status === 201)
                {
                    window.alert("User created successfully")
                    window.location.href = "http://localhost:8080/";
                }
                else{
                    window.alert("The user is already registered ")
                    window.location.href = "http://localhost:8080/login";   
                }
            })
    } catch (error) { 
        console.log(error)
    }
});