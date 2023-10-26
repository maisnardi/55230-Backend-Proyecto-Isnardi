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