import { Router } from 'express';
import { authMiddleware } from '../middlewares/AuthMiddleware';
import { EscalaMotoristaController } from '../Controller/EscalaMotoristaController';
import { asyncExecutor } from '../../utils/AsyncExecutor';

const escalaMotoristaRoutes = Router();

escalaMotoristaRoutes.get('/escalamotorista/listar', authMiddleware(['ADMIN', 'MOTORISTA']), asyncExecutor(EscalaMotoristaController.carregarListar));

escalaMotoristaRoutes.get('/escalamotorista/cadastrar', authMiddleware(['ADMIN']), asyncExecutor(EscalaMotoristaController.carregarCadastrar));
escalaMotoristaRoutes.post('/escalamotorista/cadastrar', authMiddleware(['ADMIN']), asyncExecutor(EscalaMotoristaController.cadastrar));

escalaMotoristaRoutes.get('/escalamotorista/editar/:id', authMiddleware(['ADMIN']), asyncExecutor(EscalaMotoristaController.carregarEditar));
escalaMotoristaRoutes.post('/escalamotorista/editar/:id', authMiddleware(['ADMIN']), asyncExecutor(EscalaMotoristaController.editar));



escalaMotoristaRoutes.post('/escalamotorista/excluir/:id', authMiddleware(['ADMIN']),  asyncExecutor(EscalaMotoristaController.excluir));

export {
    escalaMotoristaRoutes
};