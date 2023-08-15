//Front estatico
//Configuración de websocket del lado del cliente de la vista CHAT
const socket = io();
let username;

const ingresarButton= document.getElementById("logButton")
ingresarButton.onclick = function getUsername(){
    if(validateEmail()){
        username = document.getElementById("mail").value
        document.getElementById("userContainer").style.display = "none"
        document.getElementById("chatbox").style.display="block"
    }
    else{
        alert("Invalid email adress")
    }
}

//Recepción de historial del chat.
socket.on("chat",(data)=>{
    let messagesContainer = document.getElementById("messagesLog");
    messagesContainer.innerHTML='';
    data.forEach(element => {
       messagesContainer.innerHTML += `<div>
                                        <p><strong> ${element.user} says:</strong><br></p>
                                        <p>${element.message}<br></p>
                                    </div>` 
    });    
})

//Envío un mensaje nuevo al hacer click en el boton Send.
document.getElementById("sendButton").onclick = function send(){
    let messageData = document.getElementById("messageData").value;
    let messagesContainer = document.getElementById("messagesLog");
    messagesContainer.innerHTML += `<div id="myMessage">
                                        <p><strong> Me:</strong><br></p>
                                        <p>${messageData}<br></p>
                                    </div>`
    
    socket.emit("message", {user:username,message: messageData})
    document.getElementById("messageData").value="";
    document.getElementById('myMessage').scrollIntoView();  
};

document.addEventListener("keyup", function(event) {
    if (event.code === 'Enter') {
        if(messageData.value!=""){
            let messageData = document.getElementById("messageData").value;
            let messagesContainer = document.getElementById("messagesLog");
            messagesContainer.innerHTML += `<div id="myMessage">
                                        <p><strong> Me:</strong><br></p>
                                        <p>${messageData}<br></p>
                                    </div>`
    
            socket.emit("message", {user:username,message: messageData})
            document.getElementById("messageData").value="";
            document.getElementById('myMessage').scrollIntoView();
        }
    }
});

//Recepción de un nuevo mensaje desde el servidor.
socket.on("newMessage",(data)=>{
    let messagesContainer = document.getElementById("messagesLog");
    messagesContainer.innerHTML += `<div>
                                        <p><strong> ${data.user}:</strong><br></p>
                                        <p>${data.message}<br></p>
                                    </div>` 
})

//Funcion para validar direccion de correo.
function validateEmail(){     
	const email = document.getElementById("mail");
	const validEmail =  /^\w+([.-_+]?\w+)*@\w+([.-]?\w+)*(\.\w{2,10})+$/;
	if( validEmail.test(email.value) ){
		return true;
	}else{
		return false;
	}
} 