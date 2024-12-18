import { executaSql, getConnection } from '../db/conection';
import jwt from'jsonwebtoken';
import md5  from 'md5';
import { Request, Response } from 'express';




class UsuarioRepository {
    findAll() {}
    findById () {}
    update() {}
    delete() {}
}

export default new UsuarioRepository()