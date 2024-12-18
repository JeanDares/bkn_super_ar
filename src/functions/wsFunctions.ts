import { _APP_LANGUAGE } from "../server";
import * as fs from 'fs'
import path from 'path'
import { Response } from "express";
import { IError } from "../interfaces/appInterfaces";
import { ControllersMap } from "../controllers/_ControllersMap";
import { Grape } from "../controllers/_GrapeController";

export function getController(controller: string): Grape | null {
//    try {
        const Class = ControllersMap[controller]

        if(Class) return new Class
        else return null 
/*
        const controllerName = controller + 'Controller'
        // Importe e chame o controlador correspondente
        let arq = path.join(__dirname, '..', 'controllers', controllerName) // `./controllers/${controllerName}`
        //          let file1 = path.join(__dirname, '..','_values', `${lang}/${module}.json`)
        console.log(arq)
        if (fs.existsSync(arq + '.ts')) {
            console.log("carregou o cara")
            return require(arq).default;
        } else {
            console.log("nããããããão  carregou o cara")
            return null
//            returnError(res, _ERR_MODULE_INVALID)
        }

        //           res.status(200).send('ok')
    } catch (error) {
        // Trate erros, por exemplo, se o controlador não existir
//        console.log(error);
//        res.status(500).send(error);
    }*/

}

export function returnError(res: Response, errCode: number) {
    const err: IError = {
        errorCode: errCode,
        errorMessage: <string>getValue(errCode.toString(), "_error")
    }
    res.status(500).json(err)
}

export function getValue(key: string | string[], module: string = "", lang: string = ""): string | string[] {
    if (lang == "") lang = _APP_LANGUAGE;

    let isArray = Array.isArray(key);
    let keys: string[] = [];

    if (!isArray) keys.push(<string>key);
    else keys = <string[]>key;

    let abre1 = !(module == "");
    let abre2 = true;
    let abre3 = !(module == "");
    let abre4 = true;

    let ret: string[] = [];

    let file1 = path.join(__dirname, '..', '_values', `${lang}/${module}.json`)     // Primeiro busca no json do idioma e do objeto
    let file2 = path.join(__dirname, '..', '_values', `${lang}/_grape.json`)       // Segundo busca no json padrão do idioma
    let file3 = path.join(__dirname, '..', '_values', `${module}.json`)             // Terceiro busca no json do objeto (sem idioma)
    let file4 = path.join(__dirname, '..', '_values', `_grape.json`)    // Quarto busca no json padrão (sem idioma)

    let texts1: Record<string, any> = {};
    let texts2: Record<string, any> = {};
    let texts3: Record<string, any> = {};
    let texts4: Record<string, any> = {};

    keys.forEach(v => {
        //        console.log(v)
        if (v !== "") {
            if (abre1) {
                abre1 = false;
                if (fs.existsSync(file1)) {
                    const conteudoJSON = fs.readFileSync(file1, 'utf8');
                    texts1 = JSON.parse(conteudoJSON);
                }
            }
            if (texts1[v]) ret.push(texts1[v]);
            else {
                if (abre2) {
                    abre2 = false;
                    if (fs.existsSync(file2)) {
                        const conteudoJSON = fs.readFileSync(file2, 'utf8');
                        texts2 = JSON.parse(conteudoJSON);
                    }
                }
                if (texts2[v]) ret.push(texts2[v]);
                else {
                    if (abre3) {
                        abre3 = false;
                        if (fs.existsSync(file3)) {
                            const conteudoJSON = fs.readFileSync(file3, 'utf8');
                            texts3 = JSON.parse(conteudoJSON);
                        }
                    }
                    if (texts3[v]) ret.push(texts3[v]);
                    else {
                        if (abre4) {
                            abre4 = false;
                            if (fs.existsSync(file4)) {
                                const conteudoJSON = fs.readFileSync(file4, 'utf8');
                                texts4 = JSON.parse(conteudoJSON);
                            }
                        }
                        if (texts4[v]) ret.push(texts4[v]);
                        else {
                            let vRet = v
                            if (module !== "") vRet = module + "." + vRet;
                            ret.push(vRet)
                        }
                    }
                }
            }
        } else ret.push('');
    })

    if (!isArray) return ret[0]
    else return ret
}
