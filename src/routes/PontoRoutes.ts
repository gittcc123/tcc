import { Router } from 'express';
import { authMiddleware } from '../middlewares/AuthMiddleware';
import { PontoController } from '../Controller/PontoController';
import { asyncExecutor } from '../../utils/AsyncExecutor';

const pontoRoutes = Router();

pontoRoutes.get('/ponto/listar', authMiddleware(['ADMIN', 'USUARIO']), asyncExecutor(PontoController.carregarListar));

pontoRoutes.get('/ponto/cadastrar', authMiddleware(['ADMIN']), asyncExecutor(PontoController.carregarCadastrar));
pontoRoutes.post('/ponto/cadastrar',  authMiddleware(['ADMIN']),  asyncExecutor(PontoController.cadastrar));

pontoRoutes.get('/ponto/editar/:id',  authMiddleware(['ADMIN']), asyncExecutor(PontoController.carregarEditar));
pontoRoutes.post('/ponto/editar/:id', authMiddleware(['ADMIN']), asyncExecutor(PontoController.editar));

pontoRoutes.post('/ponto/excluir/:id', authMiddleware(['ADMIN']), asyncExecutor(PontoController.excluir));

export {
    pontoRoutes
};