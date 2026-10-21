import { Router } from 'express';
import { authMiddleware } from '../middlewares/AuthMiddleware';
import { EstadoController } from '../Controller/EstadoController';
import { asyncExecutor } from '../../utils/AsyncExecutor';

const estadoRoutes = Router();

estadoRoutes.get('/estado/listar', authMiddleware(['ADMIN']), asyncExecutor(EstadoController.carregarListar));

estadoRoutes.get('/estado/cadastrar', authMiddleware(['ADMIN']),  asyncExecutor(EstadoController.carregarCadastrar));
estadoRoutes.post('/estado/cadastrar',  authMiddleware(['ADMIN']),  asyncExecutor(EstadoController.cadastrar));

estadoRoutes.get('/estado/editar/:id', authMiddleware(['ADMIN']), asyncExecutor(EstadoController.carregarEditar));
estadoRoutes.post('/estado/editar/:id', authMiddleware(['ADMIN']), asyncExecutor(EstadoController.editar));

estadoRoutes.post('/estado/excluir/:id',  authMiddleware(['ADMIN']), asyncExecutor(EstadoController.excluir));

export {
    estadoRoutes
};