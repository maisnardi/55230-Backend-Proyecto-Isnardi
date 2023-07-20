//Front estatico
//Configuración de websocket del lado del cliente
const socket = io();

socket.on("products",(data)=>{
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
                                    <tr>
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
