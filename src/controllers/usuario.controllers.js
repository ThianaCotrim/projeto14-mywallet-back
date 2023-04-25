import { db } from "../database/database.connection.js";
import bcrypt from "bcrypt"
import { v4 as uuid } from "uuid"
import { login } from "../schemas/usuario.schemas.js";

export async function postCadastro(req, res) {

    const { nome, email, senha, confsenha } = req.body
    const senhaCript = bcrypt.hashSync(senha, 10)

    try {
        const usuarioExistente = await db.collection("infoUsuarios").findOne({ email })
        if (usuarioExistente) return res.status(409).send("Email já cadastrado anteriormente")

    } catch (err) { res.sendStatus(500) }

    if (senha !== confsenha) return res.status(409).send("Confirmação de senha não confere com a senha")

    try {
        await db.collection("infoUsuarios").insertOne({ nome, email, senha: senhaCript })
        return res.status(201).send("Usuário cadastrado com sucesso")
    } catch (err) { res.sendStatus(500) }
}

export async function postLogin(req, res) {

    const { email, senha } = req.body
    const { error } = login.validate({ email, senha }, { abortEarly: false })

    if (error) {
        const errors = error.details.map((detail) => detail.message);
        return res.status(422).send(errors)
    }
    
    try {
        const usuario = await db.collection("infoUsuarios").findOne({ email })
        if (!usuario) { return res.status(404).send("E-mail não encontrado") }

        const senhaCorreta = bcrypt.compareSync(senha, usuario.senha)
        if (!senhaCorreta) { return res.status(401).send("Senha incorreta") }

        const token = uuid()
        await db.collection("sessoes").insertOne({ token, idUsuario: usuario._id, nomePerfil: usuario.nome })
        res.send({ token, nomePerfil: usuario.nome, idUsuario: usuario._id })

    } catch (err) { res.sendStatus(500) }
}   