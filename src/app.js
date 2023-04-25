import express from "express"
import cors from "cors"
import { MongoClient} from "mongodb"
import dotenv from "dotenv"
import router from "./routes/index.routes.js"

//Criação do Servidor
const app = express();

//Configuração do Servidor
app.use(express.json())
app.use(cors())
app.use(router)
dotenv.config()

//Setup do Banco de Dados
const mongoClient = new MongoClient(process.env.DATABASE_URL)
try {
    await mongoClient.connect()
    console.log("Mongodb rodando normalmente")
} catch (err) {
    console.log(err.message)
}   
export const db = mongoClient.db()

// Servidor escutando 
const PORT = 5000;
app.listen(PORT, () => console.log(`Servidor rodando normalmente na porta ${PORT}`))



