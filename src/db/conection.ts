
import * as mysql from 'mysql2';
import { Connection } from "mysql2/typings/mysql/lib/Connection"
import { _DB_CONFIG } from "../server"

export interface DBConfig {
  host: string
  user: string
  password: string
  database: string
  port?: 3000
}

export function getConnection(dbConfig: DBConfig = _DB_CONFIG) {
  return mysql.createConnection(dbConfig);
}

export async function executaSql2<T>(cmdSQL: string, con?: Connection): Promise<T[] | null> {
  let fechaCon = false;
  if (!con) {
    con = getConnection()
    fechaCon = true;
  }

  try {
    const [rows] = await con.promise().query(cmdSQL);

    if (fechaCon) con.end();

    if (Array.isArray(rows)) {
      return rows as T[];
    }
    return null;

  } catch (error) {
    console.log(error)
    geraLog('executaSQL', cmdSQL)
    //        console.log(error)
    if (fechaCon) con.end();
    return null
  }
}


export async function executaSql<T>(cmdSQL: string, con?: Connection, geraLogErro: boolean = true): Promise<mysql.RowDataPacket[] | null> {
  let fechaCon = false;
  if (!con) {
    con = getConnection()
    fechaCon = true;
  }

  try {
    console.log('---->',cmdSQL,'<------')
    const [rows] = await con.promise().query(cmdSQL);

    console.log('---->',rows,'<------')

    if (fechaCon) con.end();

    if (Array.isArray(rows)) {
      return rows as mysql.RowDataPacket[];
    }
    return null;

  } catch (error) {
    console.log(error)
    if (geraLogErro) {
//      geraLog('executaSQL', cmdSQL)
    }
    if (fechaCon) con.end();
    return null
  }
}

export function getStringSQL(str: string): string {
  const aspas = "\\" + `"`
  let s = '"' + str.replace(/\"/g, aspas) + '"' //) + '"' //replace('"',`\\` + '"') + '"'
  return s
}

export function geraLog(modulo: string, mensagem: string) {
  const cmd = `INSERT INTO _ws_log 
               SET dataHora = now(),
                   modulo = ${getStringSQL(modulo)},
                   mensagem= ${getStringSQL(mensagem)}`
  executaSql(cmd, undefined, false)
}

export function arrayToTree2(array: any[], codigoPai:number = 0):any[] {
  const tree: any[] = [];

  array.forEach(item => {
      if (item.codigoPai === codigoPai) {
          const children = arrayToTree2(array, item.codigo);
          if (children.length) {
              item.items = children;
          }
          tree.push(item);
      }
  });

  return tree;
}


export function arrayToTree3(array: any[], codigoPai: any = null):any[] {
  const tree:any[] = [];
  array.forEach(item => {
      if (item.codigoPai === codigoPai) {
          const children = arrayToTree3(array, item.codigo);
          //let children  = array.filter(ele => ele.codigoPai == item.codigo)
          //console.log(children) 
          if (children.length) {
              item.items = children;
          }
          tree.push(item);
      }
  });

  return tree;
}



