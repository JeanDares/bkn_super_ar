import { IGResponseAut, IGRequest, IGResponse, IGRequestAut } from "./appTypes";

export interface IUsuarioLogin {
    codigo: number
    usuario: string
    tipo: number
}

export interface IGetTokenRequest extends IGRequest {
    usuario: string
    senha: string
}

export interface IGetTokenResponse extends IGResponse {
    token: string
    usuario?: string
    senhaMaster?: number
}

export interface IAlteraSenhaRequest extends IGRequestAut {
    novaSenha: string 
}

export interface IAlteraSenhaResponse extends IGResponse {
    mensagem: string
}

export interface IMenuItem {
    title: string
    url: string
    icon: string
    itens?: IMenuItem[]
}

export interface IMenu {
    menu: IMenuItem[]
}
