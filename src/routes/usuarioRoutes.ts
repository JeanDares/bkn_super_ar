import { Router } from 'express'
import { validaToken } from '../middleware/validaRequsicao.middleware';
import { UsuarioController } from '../controllers/UsuarioController';

const router = Router();
const usuarioController = new UsuarioController()

router.post('/getToken',usuarioController.getToken)
router.post('/getMenu',validaToken,usuarioController.getMenu)
router.post('/alteraSenha',validaToken,usuarioController.alteraSenha)


//// Exemplo para o GetDocumento no App
router.get('/teste',(req,resp)=>{resp.status(200).json(req.query)})

export default router

