import express from "express"
import cors from "cors"
import { MongoClient } from "mongodb"
import dotenv from "dotenv"

//Criação do Servidor
const app = express();

//Configuração do Servidor
app.use(express.json())
app.use(cors())
dotenv.config()

//Setup do Banco de Dados
let db
const mongoClient = new MongoClient(process.env.DATABASE_URL)
mongoClient.connect()
    .then(() => db = mongoClient.db())
    .catch((err) => console.log(err.message))

// Endpoint








// Servidor escutando 
const PORT = 5000;
app.listen(PORT, () => console.log(`Servidor rodando normalmente na porta ${PORT}`))