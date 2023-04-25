import express from "express"
import cors from "cors"
import { MongoClient} from "mongodb"
import dotenv from "dotenv"
import joi from "joi"
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

// Shermas
export const cadastroUsuario = joi.object({
    nome: joi.string().required(),
    email: joi.string().email().required(),
    senha: joi.string().required().min(3),
    confsenha: joi.string().required().min(3)
})

export const login = joi.object({
    email: joi.string().email().required(),
    senha: joi.string().required(),
})

export const transacao = joi.object({
    valor: joi.number().required(),
    descricao: joi.string().required(),
    tipo: joi.string().valid("credito", "debito")
})

// Servidor escutando 
const PORT = 5000;
app.listen(PORT, () => console.log(`Servidor rodando normalmente na porta ${PORT}`))



