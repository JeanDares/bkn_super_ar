import { RowDataPacket } from "mysql2";
import { _PASTARAIZ, _VERSAO } from "../app";
import { executaSql, getConnection } from "../db/conection";
import userFunction, { executeCommand } from "../functions/userFunction";
import { _URL_LOGO } from "../server";
import {
  IErrorResponse,
  IGetConfiguracoesResponse,
  IGetDocumentoRequest,
  IGetDocumentoResponse,
  IGetDocumentosRequest,
  IGetDocumentosResponse,
  IGetprodutoProcessalinkRequest,
  IGetprodutoProcessalinkResponse,
  IGRequest,
  IGResponse,
  IProdutos,
  TypedRequestBody,
  TypedResponse,
} from "../types/appTypes";
import * as fs from "fs";
import * as path from "path";
import { Request, Response, NextFunction } from "express";
import JSZip from "jszip";
import { ftpConfig } from '../server';

const ftp = require('ftp');

import { Client } from 'basic-ftp';




//const configPath = "../config.json"; // Substitua pelo caminho real
//const config = require(configPath);

const axios = require("axios");
const archiver = require("archiver");

export function getArquivosPasta(pasta: string): string[] {
  let arquivos: string[] = [];
  try {
    const files = fs.readdirSync(pasta);

    for (const file of files) {
      const filePath = `${pasta}/${file}`;
      let stats = fs.lstatSync(filePath);
      if (stats.isDirectory()) {
        if (file !== "." && file !== "..") {
          arquivos.push(...getArquivosPasta(filePath));
        }
      } else {
        arquivos.push(filePath);
      }
    }
  } finally {
  }
  return arquivos;
}

export class AppController {
  constructor() {
    console.log("passi app");
  }
  async getConfiguracoes(
    req: TypedRequestBody<IGRequest>,
    res: TypedResponse<IGetConfiguracoesResponse | IErrorResponse>,
    next: NextFunction
  ) {
    res.status(200).json({ urlLogo: _URL_LOGO });
  }

  async ping(
    req: TypedRequestBody<IGRequest>,
    res: TypedResponse<IGResponse | IErrorResponse>,
    next: NextFunction
  ) {
    res.status(200).json({ dateTime: new Date(), version: _VERSAO });
  }

  async getDocumentos(
    req: TypedRequestBody<IGetDocumentosRequest>,
    res: TypedResponse<IGetDocumentosResponse | IErrorResponse>,
    next: NextFunction
  ) {
    const param = req.body;
    const dadosToken = await userFunction.verificarToken(req.body.token);
    const con = getConnection();

    /// Filtrar extensões do usuário - _frameconteuosauxiliares

    const userDB: RowDataPacket[] | null = await executaSql(
      `
                SELECT tb.codigo, CONCAT(tb.referencia, ' - ', tb.descricao) AS rotulo, fl.ordem, fl.codigo AS codigoLink, fl.rotulo AS rotuloLink, fl.link, UPPER(IF(fl.Tipo = 2, 'LNK', RIGHT(fl.Link, LOCATE('.', REVERSE(fl.link)) - 1))) AS ext
                FROM _framelinks fl, ProdutoServico tb
                WHERE fl.Tabela = 'ProdutoServico' AND fl.CodigoRegistro = tb.Codigo
                AND (tb.Referencia LIKE "%${param.referencia}%" AND tb.Descricao LIKE "%${param.descricao}%")
                ORDER BY rotulo, referencia,descricao, ordem`,
      con
    );

    if (userDB && userDB.length > 0) {
      const produtos: IProdutos[] = userDB.map((row) => ({
        codigo: row.codigo,
        rotulo: row.rotulo,
        links: [
          {
            codigo: row.codigoLink,
            rotulo: row.rotuloLink,
            link: row.link,
            extensao: row.ext,
          },
        ],
      }));

      const response: IGetDocumentosResponse = {
        produtos,
      };
      return res.json(response);
    } else {
      const errorResponse: IErrorResponse = {
        errorCode: 404,
        errorMessage: "Nenhum resultado encontrado.",
      };
      return res.status(404).json(errorResponse);
    }
  }

  getDocumento(
    req: TypedRequestBody<IGetDocumentoRequest>,
    res: TypedResponse<IGetDocumentoResponse | IErrorResponse>,
    next: NextFunction
  ) {
    let nomeArquivo: string;
    nomeArquivo =
      "/Users/rodrigo/Desktop/Ionic/Apponta/android/app/src/main/res/drawable-land-hdpi/splash.png";

    fs.readFile(nomeArquivo, (error, data) => {
      if (error) {
        let erro: IErrorResponse = {
          errorCode: -100,
          errorMessage: error.message,
        };
        res.status(500);
      } else {
        res.end(data);
      }
    });
  }

  produtoProcessalink(
    req: TypedRequestBody<IGetprodutoProcessalinkRequest>,
    res: TypedResponse<IGetprodutoProcessalinkResponse | IErrorResponse>,
    next: NextFunction
  ) {
    const param = req.body;
    const con = getConnection();
    let arquivos: string[] = [];
    arquivos = getArquivosPasta(param.dir);

    executaSql("DROP TABLE IF EXISTS _Aux_Links", con);
    executaSql("CREATE TABLE _Aux_Links LIKE _framelinks", con);
    executaSql("SELECT @Codigo := IFNULL(MAX(Codigo),0) FROM _framelinks", con);

    arquivos.forEach((arq) => {
      let ext = path.extname(arq);
      let nme = path.basename(arq).slice(0, -ext.length);

      if (nme !== "") {
        let cmd = `INSERT INTO _Aux_Links (Tabela, Codigo, DataHora, CodigoUsuario, CodigoRegistro, Tipo, Rotulo, Link, Ordem, Origem)
                       SELECT 'ProdutoServico', @Codigo := @Codigo + 1, NOW(), 0, Codigo,1,Concat(LPAD("${nme}",8,'0'),'${ext}'), "${arq}",1,99
                       FROM produtoservico WHERE Referencia = LPAD("${nme}",8,'0')`;
        executaSql(cmd, con);
      }
    });
    executaSql("DELETE FROM _framelinks", con);
    executaSql("INSERT INTO _framelinks SELECT * FROM _Aux_Links", con);

    const response: IGetprodutoProcessalinkResponse = {
      arquivos,
    };
    return res.json(response);
  }


  async sendUpdate(req: Request, res: Response, next: NextFunction) {

//    executeCommand('npm run build',[]);

    const localPath = path.join(_PASTARAIZ, 'sendUpdate');
    if (!fs.existsSync(localPath)) fs.mkdirSync(localPath, { recursive: true });

    try {
      console.log('Iniciando envio de atualização...');
      console.log(localPath)

      const buildDir = path.join(_PASTARAIZ, 'build');
      const packArq = path.join(_PASTARAIZ, 'package.json')      // Necessário para isntalar os pacotes com NPM (npm install)
      const swaggerArq = path.join(_PASTARAIZ, 'swagger.json')   // Necessário para utilizar swagger
      const zipFileName = `build.${_VERSAO.nomeVersao}.zip`;
      const zipFilePath = path.join(localPath, zipFileName);
      console.log(buildDir)

      // Compacta a pasta "build" em um arquivo ZIP
      const output = fs.createWriteStream(zipFilePath, 'utf-8');
      const archive = archiver('zip');


      archive.pipe(output);
      const subDirName = `build.${_VERSAO.nomeVersao}`;

      console.log('Caminho da pasta build:', buildDir);
      archive.directory(buildDir, subDirName, { globOptions: { ignore: ['**/node_modules/**'] } });
      console.log('Pasta build adicionada ao ZIP.');

      // Adiciona o arquivo "config.json" diretamente à raiz do arquivo ZIP
      archive.file(packArq, { name: 'package.json' });
      archive.file(swaggerArq, { name: 'swagger.json' });




      await archive.finalize();



      console.log('Compactação concluída. Iniciando upload para o servidor FTP...');
      console.log('Tamanho do arquivo ZIP:', fs.statSync(zipFilePath).size, 'bytes');


      // Conecta-se ao servidor FTP
      const client = new Client();
      await client.access({
        host: ftpConfig.host,
        user: ftpConfig.user,
        password: ftpConfig.password,
        port: ftpConfig.port,
      });

      // Entra no diretório remoto
      await client.cd('updateWS');

      // Envia o arquivo para o servidor FTP
      const remotePath = `/updateWS/${zipFileName}`;
      await client.uploadFrom(zipFilePath, remotePath);

      // Fecha a conexão FTP
      client.close();

      console.log('Upload concluído. Fechando conexão FTP...');
      return res.json({ message: 'Envio de atualização concluído.' });
    } catch (err: any) {
      console.error('Erro ao enviar atualização:', err);
      return res.status(500).json({ error: 'Erro ao enviar atualização.' });
    }
  }



  async update(req: Request, res: Response, next: NextFunction) {
    const ftp = new Client();

    try {
      // Conecta-se ao servidor FTP
      await ftp.access({
        host: ftpConfig.host,
        user: ftpConfig.user,
        password: ftpConfig.password,
        port: ftpConfig.port,
      });

      // Lista o conteúdo da pasta "updateWS" no servidor FTP
      const files = await ftp.list('updateWS');

      // Encontrar o arquivo ZIP mais recente
      const latestVersion = files
        .filter(file => file.name.endsWith('.zip') && file.name.startsWith('build.'))
        .map(file => file.name)
        .reduce((latest, current) => {
          const latestMatch = latest.match(/build\.(\d+\.\d+\.\d+)\.zip/);
          const currentMatch = current.match(/build\.(\d+\.\d+\.\d+)\.zip/);

          if (latestMatch && currentMatch) {
            const latestVersionNumber = parseInt(latestMatch[1], 10);
            const currentVersionNumber = parseInt(currentMatch[1], 10);

            return latestVersionNumber > currentVersionNumber ? latest : current;
          } else {
            // Se uma correspondência for nula, use a outra
            return latestMatch ? latest : current;
          }
        }, '');

      if (latestVersion) {
console.log(`build.${_VERSAO.nomeVersao}.zip`, latestVersion)
        if (`build.${_VERSAO.nomeVersao}.zip` < latestVersion) {

          const updateFolder = path.join(_PASTARAIZ, 'downloadWS') 
          const zipFilePath = path.join(updateFolder,latestVersion);

          if (!fs.existsSync(updateFolder)) fs.mkdirSync(updateFolder, { recursive: true });




          // Baixe o arquivo ZIP do servidor FTP
          await ftp.downloadTo(zipFilePath, `/updateWS/${latestVersion}`);
          const currentDate = new Date().toLocaleDateString('en-GB').replace(/\//g, '');

          console.log('Download concluído. Arquivo salvo em:', zipFilePath);

          // Renomear a pasta existente para "build.data"
          const oldBuildPath = path.join(_PASTARAIZ, "build");
          if (fs.existsSync(oldBuildPath)) {
            const renamedOldBuildPath = path.join(_PASTARAIZ, `build.${_VERSAO.nomeVersao}`);

            // Remova o diretório de destino se existir
            if (fs.existsSync(renamedOldBuildPath)) {
              console.log(`Removendo diretório existente: ${renamedOldBuildPath}`);
              fs.rmdirSync(renamedOldBuildPath, { recursive: true });
            }

            // Tente renomear     
            try {

              fs.renameSync(oldBuildPath, renamedOldBuildPath);
              console.log(`Pasta antiga renomeada para: ${renamedOldBuildPath}`);
            } catch (error) {
              console.error(`Erro ao renomear a pasta antiga ${oldBuildPath} para ${renamedOldBuildPath}:`, error);
              throw error;
            }
          } else {
            console.log('Pasta "build" não encontrada para renomear.');
          }

          // Criar a nova pasta "build" para descompactar os arquivos do ZIP
//          const newBuildPath = path.join(_PASTARAIZ, "downloadWS", "build");

//          fs.mkdirSync(newBuildPath, { recursive: true });

          // Descompactar o arquivo ZIP diretamente no caminho
          const zipData = fs.readFileSync(zipFilePath);
          const zip = new JSZip();

          await zip.loadAsync(zipData);

          // Obtenha a lista de diretórios para criar a estrutura
          const directories = new Set();

          for (const [relativePath, file] of Object.entries(zip.files)) {
            if (!file.dir) {
              // Se não for um diretório, extraia e salve o conteúdo
              const filePath = path.join(_PASTARAIZ, relativePath);

              // Certifique-se de criar subdiretórios, se houver
              const dirPath = path.dirname(filePath);
              directories.add(dirPath);

              if (!fs.existsSync(dirPath)) {
                console.log(`Criando diretório: ${dirPath}`);
                fs.mkdirSync(dirPath, { recursive: true });
              }

              const content = await file.async('nodebuffer');
              try {
                fs.writeFileSync(filePath, content);
                console.log(`Arquivo extraído: ${filePath}`);
              } catch (error) {
                console.error(`Erro ao escrever o arquivo ${filePath}:`, error);
                throw error;
              }
            }
          }


          console.log('Descompactação concluída. Arquivos salvos diretamente no caminho.');

          // Renomear a pasta "build.versao" para "build"
          const oldBuildVersionPath = path.join(_PASTARAIZ, latestVersion);
          const newBuil = path.join(_PASTARAIZ, 'build');

          try {
            console.log(oldBuildVersionPath, newBuil)
            fs.renameSync(oldBuildVersionPath.slice(0, -4), newBuil);
            console.log(`Pasta 'build.versao' renomeada para 'build'.`);
          } catch (error) {
            console.error(`Erro ao renomear a pasta 'build.versao' para 'build':`, error);
            throw error;
          }

          return res.json({ folderPath: newBuil });
        } else {
          return res.status(500).json({ error: "Não há versão mais atual disponível para donwload." });
        }
      } else {
        console.error("Nenhum arquivo ZIP encontrado na pasta 'updateWS'");
        return res.status(500).json({ error: "Nenhum arquivo ZIP encontrado na pasta 'updateWS'" });
      }
    } catch (err) {
      console.error("Erro ao fazer o download ou descompactar o arquivo:", err);
      return res.status(500).json({ error: "Erro ao fazer o download ou descompactar o arquivo. Erro: " + err });
    } finally {
      // Feche a conexão FTP
      ftp.close();
    }
  }
}