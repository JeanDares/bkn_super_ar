////////////// Grape 

export interface IAction {
    id: string
    label: string
    hidden?: boolean
}

export interface IRelationField {
    mine: IField
    other: string
}

export enum IRelationType {
    OneToOne,
    OneToMany,
    ManyToOne,
    ManyToMany
}

export interface IRelation {
    id: string
    type: IRelationType
    otherGrape: string
    fields: IRelationField[]
}

export enum IFieldType {
    Number,
    Boolean,
    String,
    Date,
    DateTime,
    Email,
    Relation,
    
}

export interface IField {
    field: string
    size?: number
    required?: boolean
    key?: boolean
    mask?: string
    type: IFieldType
    decimals?: number
    hidden?: boolean
    label?: string
}

//export interface IGridFilter {
//    field: IField
//    default?: string
//}

export interface IGrid {
    id: string
    label?: string
//    filters?: IGridFilter[]
    selectedFilter?: string
    fields?: IField[]
}

export interface IDefinition {
    label: string
    labelPlur: string
    icon?: string
    fields?: IField[]
    actions?: IAction[]
    grids?: IGrid[]
    relations?: IRelation[]
}

////////////// Grape -> GetDefinition
export enum IDefinitionType {
    All,
    Fields,
    Grids,
    Actions,
    Relations
}

export interface IDefinitionRequest {
    type?: IDefinitionType
}

////////////// Grape -> Get

export enum IGetType {
    Form,
    List
}

export interface IFilterItem {
    field: string
    content: string
}

export enum IOrderType {
    ASC,
    DESC
}

export interface IOrderItem {
    fieldName: string
    type?: IOrderType
}

export interface IGetRequest {
    id?: number
    ids?: number[]
    type: IGetType
    filter?: IFilterItem[],
    order?: IOrderItem[],
    gridId?: string
    fields?: string[]
}

export interface IGetResponse {
    data: any[]
}


