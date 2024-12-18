import { _VERSAO, app } from "./app";
import { DBConfig } from "./db/conection";
import * as path from "node:path";
import fs from "node:fs";
import { Console } from "node:console";

const arqConfig = path.join(__dirname, "../config.json");
const configFile = fs.readFileSync(arqConfig, "utf8");
console.log(arqConfig);
const config = JSON.parse(configFile);

const porta = process.env.PORT || config.porta;

export const _DB_CONFIG: DBConfig = config.base;

export const ftpConfig = {
  host: process.env.FTP_HOST,
  user: process.env.FTP_USER,
  password: process.env.FTP_PASS,
  port: process.env.FTP_PORT,
};

app.listen(porta, () =>
  console.log(`App rodando na porta ${porta} - Versão: ${_VERSAO.nomeVersao}`)
);
