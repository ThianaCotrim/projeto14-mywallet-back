import { Router } from "express"
import { postCadastro, postLogin } from "../controllers/usuario.controllers.js"
import { validatSchema } from "../middlewares/validate.Schema.middlewares.js"
import { cadastroUsuario } from "../schemas/usuario.schemas.js"

const userRouter = Router()

userRouter.post("/cadastro", validatSchema(cadastroUsuario), postCadastro)
userRouter.post("/login", postLogin)

export default userRouter