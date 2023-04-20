import express from "express"
import cors from "cors"
import { MongoClient, ObjectId } from "mongodb"
import dotenv from "dotenv"
import joi from "joi"
import bcrypt from "bcrypt"
import { v4 as uuid } from "uuid"

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
        console.log("Mongodb rodando normalmente")
    })
    .catch((err) => console.log(err.message))

// Shermas

const cadastroUsuario = joi.object({
    nome: joi.string().required(),
    email: joi.string().email().required(),
    senha: joi.string().required().min(3),
    confsenha: joi.string().required().min(3)
})

const login = joi.object({
    email: joi.string().email().required(),
    senha: joi.string().required(),
})

const transacao = joi.object({
    valor: joi.number().required().positive(),
    descricao: joi.string().required(),
    tipo: joi.string().valid("credito","debito")
})

// Endpoint

app.post("/cadastro", async (req, res) => {

    const { nome, email, senha, confsenha } = req.body

    const senhaCript = bcrypt.hashSync(senha, 10)

    const validate = cadastroUsuario.validate(req.body, { abortEarly: false });

    if (validate.error) {
        const errors = validate.error.details.map((detail) => detail.message);
        return res.status(422).send(errors);
    }

    try {
        const usuarioExistente = await db.collection("infoUsuarios").findOne({ email })
        if (usuarioExistente) return res.status(409).send("Email já cadastrado anteriormente")

    } catch (err) { res.sendStatus(500) }

    if (senha !== confsenha) return res.status(409).send("Confirmação de senha não confere com a senha")


    try {
        await db.collection("infoUsuarios").insertOne({ nome, email, senha: senhaCript })
        return res.status(201).send("Usuário cadastrado com sucesso")
    } catch (err) { res.sendStatus(500) }

})

app.post("/login", async (req, res) => { 

    const { email, senha } = req.body
    // console.log(req.body)

    const {error, value} = login.validate({email, senha}, {abortEarly : false})

    if (error) {
        const errors = error.details.map((detail) => detail.message);
        return res.status(422).send(errors);
        
    }

    try {
        const usuario = await db.collection("infoUsuarios").findOne({ email })
        if (!usuario) { return res.status(404).send("E-mail não encontrado") }

        const senhaCorreta = bcrypt.compareSync(senha, usuario.senha)
        if (!senhaCorreta) { return res.status(401).send("Senha incorreta") }

        const token = uuid()
        await db.collection("sessoes").insertOne({ token, idUsuario: usuario._id })
       
        // res.send(token)
        res.status(200).send("Login realizado com sucesso")
    } catch (err) { res.sendStatus(500) }
})

app.post("/transacao", async (req, res) => {

    const { valor, descricao, tipo } = req.body

    const validate = transacao.validate(req.body, { abortEarly: false })

    if (validate.error) {
        const errors = validate.error.details.map((detail) => detail.message);
        return res.status(422).send(errors);
    }

    // console.log(validate)

    const { authorization } = req.headers

    const token = authorization?.replace("Bearer ", "")

    if (!token) return res.status(401).send("Você não possui autorização para executar essa transação")
    try{

        const sessao = await db.collection("sessoes").findOne({ token })
        if (!sessao) return res.status(401).send("Você não possui autorização para executar essa transação")
    
        const user = await db.collection("infoUsuarios").findOne({ _id: new ObjectId(sessao.idUsuario) })
        if (!user) return res.status(401).send("Ok, usuário logado")
    
        await db.collection("transacoes").insertOne(req.body)
    
        res.status(200).send("Transação inserida com sucesso")


    } catch (err) { res.sendStatus(500) }

   

})

app.get("/transacao", async (req, res) => {

    const { authorization } = req.headers

    const token = authorization?.replace("Bearer ", "")

    const sessao = await db.collection("sessoes").findOne({ token })
    if (!sessao) return res.status(401).send("Você não possui autorização para executar essa transação")
 
    try {
        
       const operacoes = await db.collection("transacoes").find().toArray()
        res.status(200).send(operacoes)

    } catch (err) { res.sendStatus(500) }
 
})


// Servidor escutando 
const PORT = 5000;
app.listen(PORT, () => console.log(`Servidor rodando normalmente na porta ${PORT}`))