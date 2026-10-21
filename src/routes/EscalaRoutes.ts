import { Router } from 'express';
import { authMiddleware } from '../middlewares/AuthMiddleware';
import { EscalaController } from '../Controller/EscalaController';
import { asyncExecutor } from '../../utils/AsyncExecutor';

const escalaRoutes = Router();

escalaRoutes.get('/escala/listar', authMiddleware(['ADMIN']), asyncExecutor(EscalaController.carregarListar));

escalaRoutes.get('/escala/cadastrar', authMiddleware(['ADMIN']), asyncExecutor(EscalaController.carregarCadastrar));
escalaRoutes.post('/escala/cadastrar', authMiddleware(['ADMIN']), asyncExecutor(EscalaController.cadastrar));

escalaRoutes.get('/escala/editar/:id', authMiddleware(['ADMIN']), asyncExecutor(EscalaController.carregarEditar));
escalaRoutes.post('/escala/editar/:id', authMiddleware(['ADMIN']), asyncExecutor(EscalaController.editar));

escalaRoutes.post('/escala/excluir/:id',  authMiddleware(['ADMIN']), asyncExecutor(EscalaController.excluir));

export {
    escalaRoutes
};