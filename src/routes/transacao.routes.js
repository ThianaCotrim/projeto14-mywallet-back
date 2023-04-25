import { Router } from "express"
import { getTransacao, postTransacao } from "../controllers/transacao.controllers.js"

const transacaoRouter = Router()

transacaoRouter.post("/transacao", postTransacao)
transacaoRouter.get("/transacao", getTransacao)

export default transacaoRouter
