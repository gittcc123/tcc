import { Router } from 'express';
import { authMiddleware } from '../middlewares/AuthMiddleware';
import { LocalizacaoVeiculoController } from '../Controller/LocalizacaoVeiculoController';
import { asyncExecutor } from '../../utils/AsyncExecutor';

const localizacaoVeiculoRoutes = Router();

localizacaoVeiculoRoutes.get( '/localizacaoVeiculo/listar', authMiddleware(['USUARIO', 'MOTORISTA', 'ADMIN']), asyncExecutor(LocalizacaoVeiculoController.carregarListar));


localizacaoVeiculoRoutes.get( '/localizacaoVeiculo/cadastrar', authMiddleware(['MOTORISTA']), asyncExecutor(LocalizacaoVeiculoController.carregarCadastrar));
localizacaoVeiculoRoutes.post( '/localizacaoVeiculo/cadastrar',  authMiddleware(['MOTORISTA']),  asyncExecutor(LocalizacaoVeiculoController.cadastrar));

localizacaoVeiculoRoutes.get( '/localizacaoVeiculo/editar/:id', authMiddleware(['MOTORISTA']), asyncExecutor(LocalizacaoVeiculoController.carregarEditar));
localizacaoVeiculoRoutes.post( '/localizacaoVeiculo/editar/:id', authMiddleware([ 'MOTORISTA']), asyncExecutor(LocalizacaoVeiculoController.editar));


localizacaoVeiculoRoutes.post( '/localizacaoVeiculo/excluir/:id', authMiddleware(['ADMIN']),  asyncExecutor(LocalizacaoVeiculoController.excluir));

export {
    localizacaoVeiculoRoutes
};