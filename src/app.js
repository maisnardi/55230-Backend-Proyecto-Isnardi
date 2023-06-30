//Importacion de modulos
import express  from "express";     //Express

const PORT = 8080;
//Inicializamos el servidor express
const app = express();

app.get('/saludo', (req,res)=>{
res.send("<h1>Hola mundo</h1>")
})

//Pongo a escuchar al servidor
app.listen(PORT, ()=>{
    console.log(`Servidor express iniciado en el puerto ${PORT} `)    
})