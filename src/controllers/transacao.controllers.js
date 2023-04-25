import { db, transacao } from "../app.js";
import dayjs from "dayjs"
import { ObjectId } from "mongodb";

export async function postTransacao(req, res) {

    const { valor, descricao, tipo } = req.body

    const newTransacao = {
        valor: valor,
        descricao: descricao,
        tipo: tipo,
        date: dayjs().format('DD/MM')
    }

    const validate = transacao.validate(req.body, { abortEarly: false })

    if (validate.error) {
        const errors = validate.error.details.map((detail) => detail.message);
        return res.status(422).send(errors)
    }

    const { authorization } = req.headers
    const token = authorization?.replace("Bearer ", "")

    if (!token) return res.status(401).send("Você não possui autorização para executar essa transação")

    try {
        const sessao = await db.collection("sessoes").findOne({ token })
        if (!sessao) return res.status(401).send("Você não possui autorização para executar essa transação")

        const user = await db.collection("infoUsuarios").findOne({ _id: new ObjectId(sessao.idUsuario) })
        if (!user) return res.status(401).send("Ok, usuário logado")

        await db.collection("transacoes").insertOne({ newTransacao, usuario: sessao.idUsuario })
        res.status(200).send("Transação inserida com sucesso")

    } catch (err) { res.sendStatus(500) }
}

export async function getTransacao(req, res) {

    const { authorization } = req.headers
    const token = authorization?.replace("Bearer ", "")

    const sessao = await db.collection("sessoes").findOne({ token })
    if (!sessao) return res.status(401).send("Você não possui autorização para executar essa transação")

    try {
        const operacoes = await db.collection("transacoes").find({ usuario: sessao.idUsuario }).toArray()
        res.status(200).send(operacoes)

    } catch (err) { res.sendStatus(500) }
}