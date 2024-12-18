import { IDefinition, IDefinitionRequest, IGetRequest, IGetResponse } from "../interfaces/grapeInterfaces"

export interface WSAction {
    id: string
    function: (params: any) => any
}

export interface WSActionGetDefinition extends WSAction {
    function: (params: IDefinitionRequest) => IDefinition
}

export interface WSActionGet extends WSAction {
    function: (params: IGetRequest) => IGetResponse
}



