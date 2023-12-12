if(document.getElementById('validation'))
{
    document.getElementById('message').remove();
    document.getElementById('form').remove();
    const button = document.createElement("button");
    button.setAttribute("class", "sendMail-button")
    button.textContent = "Go back to login";
    button.addEventListener("click", function () {
        window.location.href = "/";
    });
    const container = document.getElementById("validation");
    container.style.display="inline"
    container.appendChild(button);
}


//Formulario restore
const form = document.getElementById("loginForm");
form.addEventListener('submit', async (event) => {
    event.preventDefault();
    const data = new FormData(form)
    const obj = {};
    data.forEach((value, key) => obj[key]=value);
    try {
        const response = await fetch('/api/auth/password', {
            method: 'POST',
            body: JSON.stringify(obj),
            headers: {
                "Content-Type": "application/json",
            }
        })
        .then((res)=>{
            if(res.status === 200)
            {
                document.getElementById("message").style.display = "none";
                let title = document.getElementById("title");
                title.innerHTML = "Dont close this windows. An email has been sent with instructions. Please check your mailbox. ";
                document.getElementById("buttonMail").style.display = "none";
                document.getElementById("labelEmail").style.display = "none";
                document.getElementById("email").style.display = "none";
            }else if(res.status === 400){
                window.alert("User email does not match")
                window.location.href = "/password";
            }
            else {
                window.alert("User not found, try again")
                window.location.href = "/password";  
            }
        })
        
    } catch (error) { 
        console.log(error)
    }
});
