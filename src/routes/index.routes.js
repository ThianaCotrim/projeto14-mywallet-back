import { Router } from "express";
import userRouter from "./usuario.routes.js";
import transacaoRouter from "./transacao.routes.js";

const router = Router()
router.use(transacaoRouter)
router.use(userRouter)

export default router