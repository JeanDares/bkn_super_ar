import { Grape } from "./_GrapeController";
import { Request, Response } from "express"
import { IFieldType, IRelationType } from "../interfaces/grapeInterfaces";

export class DocumentoFiscal extends Grape {
    constructor() {
        super()
        this.tableName = 'DocumentoFiscal'
        this.id = 'DocumentoFiscal'
        let fNumero = this.addField({ field: "numero", type: IFieldType.Number })
        let fEmissao = this.addField({ field: "emissao", type: IFieldType.Date })
        let fcodigoUnidadeNegocio = this.addField({ field: "codigoUnidadeNegocio", type: IFieldType.Relation })

        this.addRelation({id: "unidadeNegocio", type: IRelationType.OneToOne, otherGrape: "UnidadeNegocio", fields: [{mine: fcodigoUnidadeNegocio, other: 'codigo'}]})

//        this.showRelationFields.push(fNumero,fEmissao,fcodigoUnidadeNegocio)

        this.addGrid({
            id: "Pais",
//            filters: [{ field: fSigla }],
//            columns: [fSigla,fDescricao]
        })
    }
}

const documentoFiscalController = (req: Request, res: Response) => {
    const pais = new DocumentoFiscal
    pais.trataRequisicao(req, res)
}

//export class pais = new Pais

export default documentoFiscalController