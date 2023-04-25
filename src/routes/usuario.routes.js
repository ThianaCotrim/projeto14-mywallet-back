import { Router } from "express"
import { postCadastro, postLogin } from "../controllers/usuario.controllers.js"

const userRouter = Router()

userRouter.post("/cadastro", postCadastro)
userRouter.post("/login", postLogin)

export default userRouter