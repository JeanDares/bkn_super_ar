import { Grape } from "./_GrapeController";
import { Request, Response } from "express"
import { IFieldType, IRelationType } from "../interfaces/grapeInterfaces";

export class Cidade extends Grape {
    constructor() {
        super()
        this.tableName = 'Cidade'
        this.id = 'Cidade'
        let fDescricao = this.addField({ field: "descricao", type: IFieldType.String })

        let fCodigoEstado = this.addField({ field: "codigoEstado", type: IFieldType.Relation })

        this.addRelation({id: "estado", type: IRelationType.ManyToOne, otherGrape: "Estado", fields: [{mine: fCodigoEstado, other: 'codigo'}]})

        this.showRelationFields.push(fDescricao, fCodigoEstado)

        this.addGrid({
            id: "cidadePorEstado",
//            filters: [{ field: fSigla }],
            fields: [fDescricao,fCodigoEstado]
        })
    }
}

const cidadeController = (req: Request, res: Response) => {
    const pais = new Cidade
    pais.trataRequisicao(req, res)
}

//export class pais = new Pais

export default cidadeController