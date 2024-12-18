import { executaSql, getConnection } from "../db/conection";
import jwt, { JwtPayload } from "jsonwebtoken";
import md5 from "md5";
import { RowDataPacket } from "mysql2";
import { TypedRequestBody } from "../types/appTypes";
import { wsSession } from "../app";
import { spawn } from "child_process";

const chaveToken = process.env._CHAVE_TOKEN;

export interface MeuPayload extends JwtPayload {
  codigo: number;
}

class UserFunction {
  GetToken(payload: any): string {
    const token = jwt.sign(payload, chaveToken, { expiresIn: "30d" });
    return token;
  }

  async verificarToken(token: string): Promise<MeuPayload> {
    try {
      const decodifica = jwt.verify(token, _CHAVE_TOKEN) as MeuPayload;
      return { codigo: decodifica.codigo };
    } catch (error) {
      return { codigo: -1 };
    }
  }

  getCodigoUsuario(): number {
    return wsSession.sessao.usuario.codigo;
  }
}

export default new UserFunction();

export function executeCommand(command: string, args: string[]): void {
  const childProcess = spawn(command, args);

  childProcess.stdout.on("data", (data) => {
    console.log(`Stdout: ${data}`);
  });

  childProcess.stderr.on("data", (data) => {
    console.error(`Stderr: ${data}`);
  });

  childProcess.on("exit", (code) => {
    console.log(`Processo finalizado com c�digo ${code}`);
  });
}
