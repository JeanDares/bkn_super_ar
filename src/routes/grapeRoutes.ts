import { Router } from 'express'
import { Grape } from '../controllers/_GrapeController';
import { validaToken } from '../middleware/validaRequsicao.middleware';

const router = Router();
const grape = new Grape()

console.log(router)
/*
router.post('/',validaToken,appController.getDocumentos)
router.get('/getDocumento',appController.getDocumento)
router.post('/getDocumento',validaToken,appController.getDocumento)
router.post('/produtoProcessaLink', appController.produtoProcessalink)
*/
export default router

