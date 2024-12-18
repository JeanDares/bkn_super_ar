import { Send } from "express-serve-static-core";
import { Request, Response } from "express";

const linkDocument = process.env._LINKDOCUMENTO;

export interface ISessao {
  token?: string;
  usuario: {
    codigo?: number;
    usuario?: string;
    tipo?: number;
  };
}

export interface TypedRequestBody<T> extends Request {
  body: T;
}

export interface TypedResponse<ResBody> extends Response {
  json: Send<ResBody, this>;
}

export interface IGRequest {}

export interface IGRequestAut extends IGRequest {
  token: string;
}

export interface IGResponse {}

export interface IGResponseAut {
  novoToken: string;
}

export interface IErrorResponse {
  errorCode: number;
  errorMessage?: string;
}

//

export interface IGetConfiguracoesResponse {
  urlLogo: string;
}

export interface IVersao {
  compilacao: number;
  versaoWS: string;
  nomeVersao: string;
}

export interface IPingResponse {
  dateTime: Date;
  version: IVersao;
}

export interface IGetDocumentosRequest {
  token: string;
  tabela: string;
  referencia?: string;
  descricao?: string;
}

export interface IGetDocumentosResponse {
  produtos: IProdutos[];
}

export interface IProdutos {
  codigo: string;
  rotulo: string;
  links: ILinks[];
}
export interface ILinks {
  codigo: string;
  rotulo: string;
  link: string;
  extensao: string;
}

export interface IGetDocumentoRequest {}

export interface IGetDocumentoResponse {
  mensagem: string;
}

export interface IGetprodutoProcessalinkRequest {
  dir: typeof linkDocument;
}

export interface IGetprodutoProcessalinkResponse {}
