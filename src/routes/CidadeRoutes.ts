import { Router } from 'express';
import { authMiddleware } from '../middlewares/AuthMiddleware';
import { CidadeController } from '../Controller/CidadeController';
import { asyncExecutor } from '../../utils/AsyncExecutor';

const cidadeRoutes = Router();

cidadeRoutes.get('/cidade/listar', authMiddleware(['ADMIN']),  asyncExecutor(CidadeController.carregarListar));

cidadeRoutes.get('/cidade/cadastrar',  authMiddleware(['ADMIN']), asyncExecutor(CidadeController.carregarCadastrar));
cidadeRoutes.post('/cidade/cadastrar',  authMiddleware(['ADMIN']), asyncExecutor(CidadeController.cadastrar));

cidadeRoutes.get('/cidade/editar/:id', authMiddleware(['ADMIN']), asyncExecutor(CidadeController.carregarEditar));
cidadeRoutes.post('/cidade/editar/:id', authMiddleware(['ADMIN']),  asyncExecutor(CidadeController.editar));

cidadeRoutes.post('/cidade/excluir/:id', authMiddleware(['ADMIN']), asyncExecutor(CidadeController.excluir));

export {
    cidadeRoutes
};