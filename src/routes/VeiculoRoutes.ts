import { Router } from 'express';
import { authMiddleware } from '../middlewares/AuthMiddleware';
import { VeiculoController } from '../Controller/VeiculoController';
import { asyncExecutor } from '../../utils/AsyncExecutor';

const veiculoRoutes = Router();

veiculoRoutes.get('/veiculo/listar', authMiddleware(['ADMIN']), asyncExecutor(VeiculoController.carregarListar));

veiculoRoutes.get('/veiculo/cadastrar', authMiddleware(['ADMIN']), asyncExecutor(VeiculoController.carregarCadastrar));
veiculoRoutes.post('/veiculo/cadastrar', authMiddleware(['ADMIN']), asyncExecutor(VeiculoController.cadastrar));


veiculoRoutes.get('/veiculo/editar/:id', authMiddleware(['ADMIN']), asyncExecutor(VeiculoController.carregarEditar));
veiculoRoutes.post('/veiculo/editar/:id',  authMiddleware(['ADMIN']), asyncExecutor(VeiculoController.editar));

veiculoRoutes.post('/veiculo/excluir/:id', authMiddleware(['ADMIN']), asyncExecutor(VeiculoController.excluir));

export {
    veiculoRoutes
};