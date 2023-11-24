//Botones del login
function redirectToRegister() {
    window.location.href = "/register";
  }
function redirectToGithub() {
    window.location.href = "http://localhost:8080/api/auth/github";
  }
function redirectToRestore() {
  window.location.href = "/restore";
}

//Formulario
const form = document.getElementById("loginForm");

form.addEventListener('submit', async (event)=>{
    event.preventDefault();
    const data = new FormData(form);
    const obj = {};
    data.forEach((value, key) => obj[key]=value);
    const response = await fetch('/api/auth/login', {
        method:'POST',
        body: JSON.stringify(obj),
        headers: {
            "Content-Type": "application/json",
        },
    })
    .then((res)=>{
        if(res.status === 200)
        {
          window.location.href = "http://localhost:8080/products"
        }
        else{
          window.alert("Invalid credentials, please check them");
          window.location.href = "http://localhost:8080/"
        }
    })
});

