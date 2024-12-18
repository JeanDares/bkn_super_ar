import { Request, Response } from "express";
import { WSAction, WSActionGetDefinition } from "../types/grapeTypes";
import { IAction, IField, IFieldType, IDefinitionRequest, IGetRequest, IGrid, IDefinition, IRelation, IOrderType, IDefinitionType } from "../interfaces/grapeInterfaces";
import { getValue, returnError } from "../functions/wsFunctions";
import { _ERR_ACTION_INVALID, _ERR_MODULE_INVALID } from "../const/errConst";
import { executaSql } from "../db/conection";
import { getController } from "./_ControllersMap";

export enum ITypeGetSQLFields {
    Key,
    All
}

interface ISQLParams { 
    tblCount: number
    selectFld: string
    leftJoin: string 
}

interface ISelectTable {
    table: string
    alias?: string
}

interface ISelectField {
    field: string
    table?: ISelectTable
}

export class Grape {
    public tableName: string = ''
    public id: string = ''

    public actions: WSAction[] = []
    public fields: IField[] = []
    public grids: IGrid[] = []
    public relations: IRelation[] = []
    public showRelationFields: IField[] = []

    public fCodigo = this.addField({ field: "codigo", type: IFieldType.Number, hidden: true, key: true })

    constructor() {
        this.addField({ field: "ativo", type: IFieldType.Boolean, hidden: true })
        this.addField({ field: "liberado", type: IFieldType.Boolean, hidden: true })
        this.addField({ field: "dataHora", type: IFieldType.DateTime, hidden: true })
        this.addField({ field: "codigoUnidade", type: IFieldType.Number, hidden: true })

        this.addAction(<WSActionGetDefinition>{ id: '_definition', function: (params) => this._definition(params) })
        this.addAction({ id: '_get', function: (params) => this._get(params) })
    }

    addGrid(grid: IGrid): IGrid {
        this.grids.push(grid)
        return grid
    }

    addField(field: IField): IField {
        if (!field.size) {
            if (field.type == IFieldType.Number) field.size = 11
            if (field.type == IFieldType.String) field.size = 10
        }
        this.fields.push(field);
        return field
    }

    getField(field: string): IField {
        let fld = this.fields.find(fld => fld.field = field)
        if (fld) return fld
        else return { field: "não Encontrado", type: IFieldType.String }
    }


    addAction(action: WSAction): WSAction {
        this.actions.push(action)
        return action
    }

    addRelation(relation: IRelation): IRelation {
        this.relations.push(relation)
        return relation
    }

    setValues(items: Record<string, any>[], key: string) {
        let lbls: string[] = <string[]>getValue(items.map(it => it[key]), this.id)
        items.forEach((it, index) => it.label = lbls[index])
    }


    _definition(params: IDefinitionRequest): IDefinition {
        let def: IDefinition = {label: <string>getValue('_label', this.id), labelPlur: <string>getValue('_labelPlur', this.id)};

        if(!params || !params.type) {
            params.type = IDefinitionType.All
        }
        console.log(params)

        this.setValues(this.fields, "field")
        this.setValues(this.grids, 'id')

        if(params.type == IDefinitionType.All || params.type == IDefinitionType.Fields)
          def.fields = this.fields
        if(params.type == IDefinitionType.All || params.type == IDefinitionType.Grids)
          def.grids = this.grids
        if(params.type == IDefinitionType.All || params.type == IDefinitionType.Actions)
          def.actions = this.getActions()
        if(params.type == IDefinitionType.All || params.type == IDefinitionType.Relations)
        def.relations = this.relations

        return def
    }

    getSQLField(type: ITypeGetSQLFields): string {
        let ret: string = '';

        if (type === ITypeGetSQLFields.All) {
            this.fields.forEach(fld => ret += fld.field + ',')
            ret = ret.slice(0, -1)
        } else if (type === ITypeGetSQLFields.Key) this.fields.forEach(fld => { if (fld.key) ret += fld.field })

        return ret
    }

    SQLgetRelationFields(rel: IRelation, params: ISQLParams) {
        const grp = getController(rel.otherGrape)
        console.log("----->",rel.otherGrape, grp)
        if (grp !== null) {
            console.log(grp.id)
            if (grp.showRelationFields.length > 0) {
                console.log(grp.showRelationFields)
                const ljAliasAnt = `t${params.tblCount}`

                params.tblCount++

                const ljAlias = `t${params.tblCount}`

                let flds = ""
                rel.fields.forEach(fld => {
                    flds += `${ljAlias}.${fld.other} = ${ljAliasAnt}.${fld.mine.field} AND `
                }) 
                if(flds !== "") {
                    params.leftJoin += `LEFT JOIN ${grp.tableName} as ${ljAlias} ON ${flds.slice(0,-5)}\n`
                    grp.SQLgetSelectFields(grp.showRelationFields, params, true)
                }

            }
        }
    }

    SQLgetSelectFields(fields: IField[], params: ISQLParams, relation: boolean = false) {
        fields.forEach(fld => {
            const tblAlias = 't' + params.tblCount;

            params.selectFld += `${tblAlias}.${fld.field} as ${fld.field}_${tblAlias},`
//            if (!relation) params.selectFld += `${tblAlias}.${fld.field},`
//            else params.selectFld += `${tblAlias}.${fld.field} as ${this.id}_${fld.field}_${tblAlias},`
            if (fld.type === IFieldType.Relation) {
                console.log("Campo Relation: " + fld.field)
                this.relations.forEach(rel => {
                    console.log(this.relations)
                    rel.fields.forEach(rf => {
                        if (rf.mine === fld) {
                            this.SQLgetRelationFields(rel,params)
                        }
                    })
                })
            }
        })
    }

    async _get(params: IGetRequest) {

        let selFlds: string = "";
        let tables: ISelectTable[] = [];
        let fieldsSel: ISelectField[];

        //        let tbl: ISelectTable = {table: this.tableName}
        let tbl: ISelectTable = tables[tables.push({ table: this.tableName, alias: "t0" })];

//        let selectFld: string = ""
        let whereFld: string = ""

        let ljCount = 1;
        let sqlParam: ISQLParams = {tblCount: 0, selectFld: "", leftJoin: ""}
;
        this.SQLgetSelectFields(this.fields,sqlParam)

        let selectFld = sqlParam.selectFld.slice(0,-1)
        let leftJoin = sqlParam.leftJoin

        console.log(sqlParam)

        let where: string = ''
        if (params.id) where += ` AND Codigo= ${params.id}`;
        if (params.ids && Array.isArray(params.ids)) {
            let whereIds = ""
            let ids: number[] = params.ids
            ids.forEach(id => whereIds += ` OR Codigo=${id}`)
            where += ` AND (${whereIds.substring(4)})`
        }
        if (params.filter) {

        }
        let order: string = ''
        if (params.order && Array.isArray(params.order)) {
            params.order.forEach(ord => {
                order += ',' + ord.fieldName
                if(ord.type == IOrderType.DESC) order += ' DESC'
            })
            order = `ORDER BY ${order.substring(1)}`
        }
        let limit: string = ''

        if(where !== "") where = ` WHERE ${where.substring(5)}`

        let cmd: string = `SELECT ${selectFld} 
                           FROM ${this.tableName} as t0
                           ${leftJoin}
                           ${where}
                           ${order}
                           ${limit}`
        console.log(cmd)

        const tblRet = await executaSql(cmd)

//        console.log(tblRet)

        //let data = tbl //[{ "codigo": 10 }]
        return tblRet
    }

    getActions(): IAction[] {
        let ret: IAction[] = [];
        this.actions.forEach(act => ret.push({
            id: act.id,
            label: <string>getValue(act.id, this.id)
        }));
        return ret
    }

    getGrids(): IGrid[] {
        //        let ret: IGrid[] = []
        return this.grids
    }

    async trataRequisicao(req: Request, res: Response) {
        const params = req.body
        let acao = params._action
        if (req.params.action && req.params.action !== "") acao = `_${req.params.action}`
        acao = acao.toUpperCase()
        if (acao && acao !== "") {
            for (const act of this.actions) {
                if (act.id.toUpperCase() === acao) {
                    const ret = await act.function(params)
                    res.status(200).json(ret);
                    return; // Use 'return' para sair do loop quando encontrar uma correspondência
                }
            }
        }
        returnError(res, _ERR_ACTION_INVALID)
    }
}