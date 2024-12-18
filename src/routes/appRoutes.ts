import { Router } from 'express'
import { AppController } from '../controllers/AppController';
import { validaToken } from '../middleware/validaRequsicao.middleware';

const router = Router();
const appController = new AppController()

router.get('/getConfiguracoes',appController.getConfiguracoes)
router.get('/ping',appController.ping)
router.post('/getDocumentos',validaToken,appController.getDocumentos)
router.get('/getDocumento',appController.getDocumento)
router.post('/getDocumento',validaToken,appController.getDocumento)
router.post('/produtoProcessaLink', appController.produtoProcessalink)
router.get('/update', appController.update);
router.get('/sendUpdate', appController.sendUpdate);




export default router

