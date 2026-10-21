import { Router } from 'express';

import { authMiddleware } from '../middlewares/AuthMiddleware';
import { AlertaController } from '../Controller/AlertaController';
import { asyncExecutor } from '../../utils/AsyncExecutor';

const alertaRoutes = Router();

alertaRoutes.get( '/alerta/listar', authMiddleware(['USUARIO', 'MOTORISTA', 'ADMIN']), asyncExecutor(AlertaController.carregarListar));

alertaRoutes.get('/alerta/cadastrar', authMiddleware(['MOTORISTA', 'ADMIN']), asyncExecutor(AlertaController.carregarCadastrar));
alertaRoutes.post( '/alerta/cadastrar', authMiddleware(['MOTORISTA', 'ADMIN']), asyncExecutor(AlertaController.cadastrar));

alertaRoutes.get( '/alerta/editar/:id', authMiddleware(['ADMIN']), asyncExecutor(AlertaController.carregarEditar));
alertaRoutes.post('/alerta/editar/:id',authMiddleware(['ADMIN']), asyncExecutor(AlertaController.editar));

alertaRoutes.post('/alerta/excluir/:id', authMiddleware(['MOTORISTA', 'ADMIN']), asyncExecutor(AlertaController.excluir));

export {
    alertaRoutes
};

