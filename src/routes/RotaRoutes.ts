import { Router } from 'express';
import { authMiddleware } from '../middlewares/AuthMiddleware';
import { RotaController } from '../Controller/RotaController';
import { asyncExecutor } from '../../utils/AsyncExecutor';

const rotaRoutes = Router();

rotaRoutes.get('/rota/listar', authMiddleware(['ADMIN', 'USUARIO', 'MOTORISTA']), asyncExecutor(RotaController.carregarListar));

rotaRoutes.get('/rota/cadastrar', authMiddleware(['ADMIN', 'MOTORISTA']), asyncExecutor(RotaController.carregarCadastrar));
rotaRoutes.post('/rota/cadastrar', authMiddleware(['ADMIN', 'MOTORISTA']), asyncExecutor(RotaController.cadastrar));

rotaRoutes.get('/rota/editar/:id',  authMiddleware(['ADMIN', 'MOTORISTA' ]),  asyncExecutor(RotaController.carregarEditar));
rotaRoutes.post('/rota/editar/:id', authMiddleware(['ADMIN', 'MOTORISTA']), asyncExecutor(RotaController.editar));

rotaRoutes.post('/rota/excluir/:id', authMiddleware(['ADMIN', 'MOTORISTA']), asyncExecutor(RotaController.excluir));

export {
    rotaRoutes
};