//Función para verificar que las dos passwords ingresados sean iguales.
const check = function() {
    if (document.getElementById('password').value == document.getElementById('confirmPassword').value) {
        document.getElementById('message').innerHTML = '';
        document.getElementById("changeButton").disabled = false;
    } else {
        document.getElementById('message').style.color = 'red';
        document.getElementById('message').innerHTML = 'Passwords do not match';
        document.getElementById("changeButton").disabled = true;
    }
  }

const changed = document.getElementById('response')
if(changed)
{
    document.getElementById("changeButton").style.display = "none";
    document.getElementById("changeButton").remove()
    document.getElementById("passlabel1").style.display = "none";
    document.getElementById("password").style.display = "none";
    document.getElementById("passlabel2").style.display = "none";
    document.getElementById("confirmPassword").style.display = "none";
    document.getElementById("titleChange").style.display = "none";
    
    const button = document.createElement("button");
    button.textContent = "Sing in";
    button.addEventListener("click", function () {
        window.location.href = "/";
    });
    const container = document.getElementById("buttonContainer");
    container.appendChild(button);
}