import { Cidade } from "./CidadeController";
import { Estado } from "./EstadoController";
import { Pais } from "./PaisController";
import { UnidadeNegocio } from "./UnidadeNegocioController";
import { Grape } from "./_GrapeController";

export const ControllersMap: { [chave: string]: any } = {
    "Pais": Pais,
    "Estado": Estado,
    "Cidade": Cidade,
    "UnidadeNegocio": UnidadeNegocio
}

export function getController(controller: string): Grape | null {
    const Class = ControllersMap[controller]

    if (Class) return new Class
    else return null
 }


