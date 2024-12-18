import { Grape } from "./_GrapeController";
import { Request, Response } from "express"
import { IFieldType, IRelationType } from "../interfaces/grapeInterfaces";

export class Pais extends Grape {
    constructor() {
        super()
        this.tableName = 'Pais'
        this.id = 'Pais'
        let fSigla = this.addField({ field: "sigla", type: IFieldType.String })
        let fDescricao = this.addField({ field: "descricao", type: IFieldType.String })

        this.addRelation({id: "estado", type: IRelationType.OneToMany, otherGrape: "estado", fields: [{mine: this.fCodigo, other: 'codigoPais'}]})

        this.showRelationFields.push(fDescricao)

        this.addGrid({
            id: "Pais",
            fields: [fSigla,fDescricao]
        })
    }
}

const paisController = (req: Request, res: Response) => {
    const pais = new Pais
    pais.trataRequisicao(req, res)
}

//export class pais = new Pais

export default paisController