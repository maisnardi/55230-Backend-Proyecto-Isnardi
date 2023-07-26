//Front estatico
//Configuración de websocket del lado del cliente
const socket = io();

socket.on("products",(data)=>{
    console.log("llegan los productos")
    console.log(data)
    let contenedor = document.getElementById('tabla');
    contenedor.innerHTML=`<tr id="encabezado">
    <td>ID</td>
    <td>Category</td>
    <td>Title</td>
    <td>Description</td>
    <td>Price</td>
    <td>Thumbnails</td>
    <td>Code</td>
    <td>Stock</td>
    <td>Status</td>
</tr>`;
    data.forEach(element => {
        contenedor.innerHTML += `
                                    <tr id="p${element.id}">
                                        <td>${element.id}</td>
                                        <td>${element.category}</td>
                                        <td>${element.title}</td>
                                        <td>${element.description}</td>
                                        <td>${element.price}</td>
                                        <td>${element.thumbnails}</td>
                                        <td>${element.code}</td>
                                        <td>${element.stock}</td>
                                        <td>${element.status}</td>
                                    </tr>`
                                });
})
//Función para elemininar un producto de la vista /realtiemeproducts por sockets.
socket.on("delete", (data)=>{
    const pid="p"+data;
    const element = document.getElementById(pid);
    element.remove(); 
})

//Función para actualizar la lista de productos de la vista /realtiemeproducts por sockets.
socket.on("newProduct", (data, id)=>{
    console.log("llega la solicitud de nuevo producto")
    let contenedor = document.getElementById('tabla');
    contenedor.innerHTML += `
                                <tr id="p${id}">
                                    <td>${id}</td>
                                    <td>${data.category}</td>
                                    <td>${data.title}</td>
                                    <td>${data.description}</td>
                                    <td>${data.price}</td>
                                    <td>${data.thumbnails}</td>
                                    <td>${data.code}</td>
                                    <td>${data.stock}</td>
                                    <td>${data.status}</td>
                                </tr>`

})