import { NextFunction } from "connect";
import { Grape } from "./_GrapeController";
import { Request, Response } from "express"
import { IFieldType, IRelation, IRelationType } from "../interfaces/grapeInterfaces";

export class Estado extends Grape {
    constructor() {
        super()
        this.tableName = 'Estado'
        this.id = 'Estado'
        let fSigla = this.addField({ field: "sigla", type: IFieldType.String })
        let fDescricao = this.addField({ field: "descricao", type: IFieldType.String })
        let fCodigoPais = this.addField({ field: "codigoPais", type: IFieldType.Relation })

        this.addRelation({id: "pais", type: IRelationType.ManyToOne, otherGrape: "Pais", fields: [{mine: fCodigoPais, other: 'codigo'}]})

        this.showRelationFields.push(fSigla, fDescricao, fCodigoPais)

        this.addGrid({
            id: "Estado",
            fields: [fSigla,fDescricao]
        })
    }
}

const estadoController = (req: Request, res: Response) => {
    const pais = new Estado
    pais.trataRequisicao(req, res)
}

export default estadoController