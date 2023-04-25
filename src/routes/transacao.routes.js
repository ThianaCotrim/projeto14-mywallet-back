import { Router } from "express"
import { getTransacao, postTransacao } from "../controllers/transacao.controllers.js"
import { validateSchema } from "../middlewares/validate.Schema.middlewares.js"
import { transacao } from "../schemas/transacao.schemas.js"

const transacaoRouter = Router()

transacaoRouter.post("/transacao", validateSchema(transacao), postTransacao)
transacaoRouter.get("/transacao", getTransacao)

export default transacaoRouter