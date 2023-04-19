import express from "express"
import cors from "cors"
import { MongoClient } from "mongodb"
import dotenv from "dotenv"
import joi from "joi"
import bcrypt from "bcrypt"

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
    .then(() => {
        db = mongoClient.db()
        console.log("Mongodb rodando normalmente")})
    .catch((err) => console.log(err.message))

// Shermas

 const cadastroUsuario = joi.object({
    name: joi.string().required(),
    email: joi.string().email().required(),
    senha: joi.string().required().min(3),
    confsenha: joi.string().required().min(3)
 })

// Endpoint

app.post("/cadastro", async (req, res) => {
    const {name, email, senha, confsenha} = req.body

    const senhaCript = bcrypt.hashSync(senha, 10)

    const validate = cadastroUsuario.validate(req.body, {abortEarly: false});

    if(validate.error){
        const errors = validate.error.details.map((detail) => detail.message);
        return res.status(422).send(errors);
    }

    try{

       const usuarioExistente = await db.collection("infoUsuarios").findOne({email})

       if(usuarioExistente){
        return res.status(409).send("Email já cadastrado anteriormente")
       }

    }catch(err){
        res.sendStatus(500)
    }

    if(senha !== confsenha){
        return res.status(409).send("Confirmação de senha não confere com a senha")
    }


    try {
        await db.collection("infoUsuarios").insertOne({name, email, senha: senhaCript})
        return res.status(201).send("Usuário cadastrado com sucesso")
    } catch (err){
        res.sendStatus(500)
    }

})







// Servidor escutando 
const PORT = 5000;
app.listen(PORT, () => console.log(`Servidor rodando normalmente na porta ${PORT}`))