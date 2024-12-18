import { Request, Response } from "express";
import express from "express";
import cors from "cors";

import usuarioRoutes from "./routes/usuarioRoutes";
import appRoutes from "./routes/appRoutes";
import grapeRoutes from "./routes/grapeRoutes";
import {
  validaJsonBody,
  trataErro,
  validaToken,
} from "./middleware/validaRequsicao.middleware";
import { IVersao } from "./types/appTypes";

import path from "node:path";
import * as fs from "node:fs";
import { getValue, returnError } from "./functions/wsFunctions";
import { _ERR_MODULE_INVALID } from "./const/errConst";

const swaggerUi = require("swagger-ui-express"),
  swaggerDocument = require("../swagger.json");

export const wsSession = require("express-session");

export const _PASTARAIZ = path.join(__dirname, "..");

console.log(_PASTARAIZ);
export const _VERSAO: IVersao = {
  compilacao: 1,
  versaoWS: "v1",
  nomeVersao: "4.0.9",
};
export const _PASTA_WS = "/" + _VERSAO.versaoWS;

export const app = express();

function grapeRequest(req: Request, res: Response) {
  const parametro = req.params.grape;

  const controllerName = parametro + "Controller";

  try {
    let arq = path.join(__dirname, "controllers", controllerName); // `./controllers/${controllerName}`
    //          let file1 = path.join(__dirname, '..','_values', `${lang}/${module}.json`)
    let arqController = arq + ".js";
    if (!fs.existsSync(arqController)) arqController = arq + ".ts";
    if (fs.existsSync(arqController)) {
      const controller = require(arqController).default;
      controller(req, res);
    } else {
      returnError(res, _ERR_MODULE_INVALID);
    }
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
}

app.use(
  wsSession({
    secret: "lsslldkfjalkfjal",
  })
);

app.use(cors());
app.use(express.json());
app.use(validaJsonBody);

app.use(_PASTA_WS + "/usuario", usuarioRoutes);
app.use(_PASTA_WS + "/app", appRoutes);

app.post(_PASTA_WS + "/:grape", validaJsonBody, validaToken, grapeRequest);
app.post(
  _PASTA_WS + "/:grape/:action",
  validaJsonBody,
  validaToken,
  grapeRequest
);

app.use("*", (req, res, next) => {
  const error = new Error("_ROTA_INVALIDA");
  next(error);
});

app.use(trataErro);
