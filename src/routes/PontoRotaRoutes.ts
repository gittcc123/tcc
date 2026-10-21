
import { Router } from 'express';
import { authMiddleware } from '../middlewares/AuthMiddleware';
import { PontoRotaController } from '../Controller/PontoRotaController';
import { asyncExecutor } from '../../utils/AsyncExecutor';
const pontoRotaRoutes = Router();


pontoRotaRoutes.get( '/pontoRota/listar', authMiddleware(['ADMIN']), asyncExecutor(PontoRotaController.carregarListar));


pontoRotaRoutes.get( '/pontoRota/cadastrar', authMiddleware(['ADMIN']), asyncExecutor(PontoRotaController.carregarCadastrar));
pontoRotaRoutes.post( '/pontoRota/cadastrar', authMiddleware(['ADMIN']), asyncExecutor(PontoRotaController.cadastrar));


pontoRotaRoutes.get( '/pontoRota/editar/:id', authMiddleware(['ADMIN']), asyncExecutor(PontoRotaController.carregarEditar));
pontoRotaRoutes.post( '/pontoRota/editar/:id', authMiddleware(['ADMIN']),  asyncExecutor(PontoRotaController.editar));


pontoRotaRoutes.post( '/pontoRota/excluir/:id', authMiddleware(['ADMIN']),  asyncExecutor(PontoRotaController.excluir));


export {
  pontoRotaRoutes
  };
