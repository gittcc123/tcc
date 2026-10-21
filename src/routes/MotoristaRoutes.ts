import { Router } from 'express';
import { authMiddleware } from '../middlewares/AuthMiddleware';
import { MotoristaController } from '../Controller/MotoristaController';
import { asyncExecutor } from '../../utils/AsyncExecutor';

const motoristaRoutes = Router();

motoristaRoutes.get('/motorista/listar', authMiddleware(['ADMIN']), asyncExecutor(MotoristaController.carregarListar));

motoristaRoutes.get('/motorista/cadastrar', authMiddleware(['ADMIN']), asyncExecutor(MotoristaController.carregarCadastrar));
motoristaRoutes.post('/motorista/cadastrar',  authMiddleware(['ADMIN']), asyncExecutor(MotoristaController.cadastrar));

motoristaRoutes.get('/motorista/editar/:id', authMiddleware(['ADMIN']), asyncExecutor(MotoristaController.carregarEditar));
motoristaRoutes.post('/motorista/editar/:id', authMiddleware(['ADMIN']), asyncExecutor(MotoristaController.editar));

motoristaRoutes.post('/motorista/excluir/:id', authMiddleware(['ADMIN']), asyncExecutor(MotoristaController.excluir));

export {
    motoristaRoutes
};