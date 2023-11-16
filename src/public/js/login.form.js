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
    console.log(obj);

    const response = await fetch('/api/login', {
        method:'POST',
        body: JSON.stringify(obj),
        headers: {
            "Content-Type": "application/json",
        },
    });
    const responseData = await response.json();
    console.log(responseData)
    if(responseData.error)
    {
      return alert("invalid credentials");
    }
    // localStorage.setItem("accessToken", responseData.accessToken);
    window.location.href = "http://localhost:8080/products";
});

