import { Grape } from "./_GrapeController";
import { Request, Response } from "express"
import { IFieldType, IRelationType } from "../interfaces/grapeInterfaces";

export class UnidadeNegocio extends Grape {
    constructor() {
        super()
        this.tableName = 'UnidadeNegocio'
        this.id = 'UnidadeNegocio'
        let fNome = this.addField({ field: "nome", type: IFieldType.String })
        let fNomeFantasia = this.addField({ field: "nomeFantasia", type: IFieldType.String })
        let fCNPJCPF = this.addField({ field: "cnpjCpf", type: IFieldType.String })
        let fEndereco = this.addField({ field: "endereco", type: IFieldType.String })

        let fCodigoCidade = this.addField({ field: "codigoCidade", type: IFieldType.Relation })

        this.addRelation({id: "cidade", type: IRelationType.ManyToOne, otherGrape: "Cidade", fields: [{mine: fCodigoCidade, other: 'codigo'}]})
        this.addRelation({id: "documentosFiscais",type: IRelationType.OneToMany,otherGrape: "DocumentoFiscal",fields:[{mine: this.fCodigo,other:'codigoUnidadeNegocio'}]})

        this.showRelationFields.push(fNome,fCNPJCPF,fCodigoCidade)

        this.addGrid({
            id: "nome",
//            filters: [{ field: fSigla }, {field: fDescricao}],
            fields: [fNome, fNomeFantasia, fCNPJCPF, fEndereco]
        })
        this.addGrid({
            id: "porCidade",
//            filters: [{ field: fSigla }, {field: fDescricao}],
            fields: [fNome, fNomeFantasia, fCNPJCPF,fCodigoCidade]
        })

    }
}

const UnidadeNegocioController = (req: Request, res: Response) => {
    const pais = new UnidadeNegocio
    pais.trataRequisicao(req, res)
}

export default UnidadeNegocioController