import { arrayToTree2, executaSql, executaSql2, getConnection, getStringSQL } from '../db/conection';
import jwt from 'jsonwebtoken';
import md5 from 'md5';
import { IErrorResponse, IGRequestAut, IGResponse, TypedRequestBody, TypedResponse } from '../types/appTypes';
import { IAlteraSenhaRequest, IAlteraSenhaResponse, IGetTokenRequest, IGetTokenResponse, IMenu, IMenuItem } from '../types/usuarioTypes';
import userFunction from '../functions/userFunction';
import { NextFunction } from 'express';

import { _SENHA_MASTER } from '../server';
import { FileWatcherEventKind } from 'typescript';
import { returnError } from '../functions/wsFunctions';
import { _ERR_USER_INVALID } from '../const/errConst';
//import { push } from 'mysql2/lib/constants/charset_encodings';

export function strCount(inputString: string, caracterContar: string): number {
  let count = 0;
  for (let i = 0; i < inputString.length; i++) {
    if (inputString[i] === caracterContar) {
      count++;
    }
  }

  return count;
}

export function contaRotas(ele: IMenuItem): number {
  let qtdRotas = 0
  if (ele.url) qtdRotas++
  if (ele.itens && ele.itens.length > 0) ele.itens.forEach((ite: IMenuItem) => { qtdRotas += contaRotas(ite) })
  //  if(ele.itens) qtdRotas += contaRotas(ele.itens)
  return qtdRotas
}

export function listToTree(list: any[]): any[] {
  let tree = []
  let pai: any[] = []

  let i = 0
  while (i < list.length) {
    let iNivel = strCount(list[i].classificacao, '.') + 1;
    if (iNivel == 1) {
      let k = tree.push(list[i])
      pai.push({ codigo: list[i].codigo, it: tree[k - 1] })
    } else {
      for (let j = pai.length - 1; j >= 0; j--) {
        if (list[i].codigoPai == pai[j].codigo) {
          if (!pai[j].it.itens) pai[j].it.itens = []
          let k = pai[j].it.itens.push(list[i])
          pai.push({ codigo: list[i].codigo, it: pai[j].it.itens[k - 1] })
          break
        }
      }
    }
    i++
  }

  tree.forEach((ele, index, object) => {
    let qtdRotas = contaRotas(ele)
    if (qtdRotas == 0) object.splice(index, 1)
  })
  return tree
}

export function SenhaMaster(senha: string): number | undefined {
  if (senha == "a2015fe4ce7e31a8d7bf8b1d318ec711")
    return 1
  else if (senha == _SENHA_MASTER)
    return 2
  else
    return 0
}

export async function CodigosModulosLiberados(codigoUsuario: number): Promise<number[]> {
  let cmd = `SELECT mo.codigo
             FROM (_ws_usuariomodulo um,_ws_modulo mo) 
             WHERE (um.codigomodulo = 0 OR um.codigomodulo = mo.codigo or mo.Visibilidade = 99)
                   AND um.codigousuario = ${codigoUsuario}`;
  //             UNION  
  //             SELECT mo.codigo
  //             FROM (_ws_modulo mo) 
  //             WHERE (mo.Visibilidade = 99)`
  const res = await executaSql(cmd)
  let result: number[] = []
  if (res) res.forEach(ele => { result.push(ele.codigo) })
  return result
}

export class UsuarioController {
  async getToken(req: TypedRequestBody<IGetTokenRequest>, res: TypedResponse<IGetTokenResponse | IErrorResponse>, next: NextFunction) {

    const param = req.body

    const con = getConnection();

    let cmd = `SELECT codigo,usuario,senha 
    FROM usuario 
    WHERE Ativo = 1 AND Usuario = ${getStringSQL(param.usuario)}`

    const userDB = await executaSql(cmd, con)

    const senhaMD5 = md5(param.senha)

    let ehSenhaMaster = SenhaMaster(senhaMD5)

    console.log(ehSenhaMaster)
    console.log(userDB)

    con.end()

    if (userDB && userDB.length > 0 && (userDB[0].senha == senhaMD5 || ehSenhaMaster)) {
      let result: IGetTokenResponse = {
        token: await userFunction.GetToken({ codigo: userDB[0].codigo }),
        usuario: userDB[0].usuario
      }

      if (userDB[0].senha !== senhaMD5) {
        result.senhaMaster = SenhaMaster(senhaMD5);
      }

      res.status(200).json(result)

    } else {
      returnError(res,_ERR_USER_INVALID)
    }
  }

  async getMenu(req: TypedRequestBody<IGRequestAut>, res: TypedResponse<IMenu>) {

    let codigos = await CodigosModulosLiberados(userFunction.getCodigoUsuario())
    let whereCod = ``
    if (codigos.length > 0) whereCod = `or mo.Codigo in (${codigos.toString()})`

    let cmd = `SELECT mn.classificacao, mn.codigo, mn.codigoPai, if(mn.rotulo <>"",mn.rotulo,mo.Rotulo) rotulo, if(mn.icone <> "",mn.icone,mo.icone) icone, mo.rota, mo.rota url
                 FROM _ws_menu mn
                 LEFT JOIN _ws_modulo mo ON mo.Codigo = mn.codigoModulo
                 WHERE (mn.codigoModulo = 0 ${whereCod})
                 ORDER BY mn.classificacao`;
    const tbl = await executaSql(cmd)
    let itens: IMenuItem[] = []
    let its: IMenuItem[] = []
    if (tbl) {
      its = listToTree(tbl)

    }
    res.status(200).json({ menu: its })
  }

  async alteraSenha(req: TypedRequestBody<IAlteraSenhaRequest>, res: TypedResponse<IAlteraSenhaResponse | IErrorResponse>) {
    const dadosToken = await userFunction.verificarToken(req.body.token);
    if (dadosToken) {
      let novaSenha = req.body.novaSenha.trim()
      if (novaSenha === "") res.status(400).json({ errorCode: -1, errorMessage: "Senha inválida" })
      else {
        const con = getConnection();

        //      const codigo = dadosToken.codigo

        // A senha atual é válida, agora atualize a senha no banco de dados com a nova senha
        const md5NovaSenha = md5(req.body.novaSenha);
        await executaSql(`UPDATE usuario SET Senha = "${md5NovaSenha}" WHERE Codigo = ${dadosToken.codigo}`, con);

        return res.status(200).json({ mensagem: "Senha alterada com sucesso" });
      }
    } else {
      return res.status(400).json({ errorCode: -1, errorMessage: "Token inválido" })
    }
  }

}
