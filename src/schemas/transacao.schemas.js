import joi from "joi"

export const transacao = joi.object({
    valor: joi.number().required(),
    descricao: joi.string().required(),
    tipo: joi.string().valid("credito", "debito")
})