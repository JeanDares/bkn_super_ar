import { NextFunction, Request, Response } from "express"
import session from "express-session";
import { wsSession } from "../app";
import userFunction, { MeuPayload } from "../functions/userFunction";
import { ISessao } from "../types/appTypes";


export function trataErro(err: Error, req: Request, res: Response, next: NextFunction) {
    if (err instanceof SyntaxError) {
        if ('body' in err) return res.status(400).json({ error: 'Mensagem deve possuir um objeto JSON válido' })
    }
    else if (err.message == "_ROTA_INVALIDA") return res.status(400).json({ error: "Rota inválida" })
    else next();
}

export function validaJsonBody(req: Request, res: Response, next: NextFunction) {
    console.log(req.body)
    if(req.method === 'POST' && (!req.body || Object.keys(req.body).length === 0)) {
        return res.status(400).json({ error: 'Mensagem deve possuir um JSON como POST' });
    }
    next();
}

export function validaRequest(req: Request, int: any): boolean {
    req.on("error", (e) => { console.error(`problem with request: ${e.message}`); })
    if (req.is('application/json')) {
        try {
            let param = req.body
            return true
        } catch (error) {
            return false
        }
    } else return true
}

export async function validaToken(req: Request, res: Response, next: NextFunction) {
    let token = req.headers['authorization'];

    if (token && token !== "") req.body.token = token
    else token = req.body.token;

    if (!token) res.status(400).json({ error: -1, errorMsg: "Token é obrigatório" })
    else {
       const tokenValido: MeuPayload = await userFunction.verificarToken(token)
       if (tokenValido.codigo <= 0) res.status(400).json({ error: -1, errorMsg: "Token inválido" })
       else {
           //session. .token = token
           let sessao: ISessao = {
               token: token,
               usuario: {
                   codigo: tokenValido.codigo
               }
           };
           wsSession.sessao = sessao
           return next()
       }
    }
}
