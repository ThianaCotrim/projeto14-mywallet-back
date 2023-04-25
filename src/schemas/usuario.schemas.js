import joi from "joi"

export const login = joi.object({
    email: joi.string().email().required(),
    senha: joi.string().required(),
})

export const cadastroUsuario = joi.object({
    nome: joi.string().required(),
    email: joi.string().email().required(),
    senha: joi.string().required().min(3),
    confsenha: joi.string().required().min(3)
})