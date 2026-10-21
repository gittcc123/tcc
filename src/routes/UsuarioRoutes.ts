import { Router } from 'express';
import { authMiddleware } from '../middlewares/AuthMiddleware';
import { UsuarioController } from '../Controller/UsuarioController';
import { asyncExecutor } from '../../utils/AsyncExecutor';
import upload from '../../public/config/upload';

const usuarioRoutes = Router();

usuarioRoutes.get('/usuario/logar', asyncExecutor(UsuarioController.carregarLogin));


usuarioRoutes.post('/usuario/logar', asyncExecutor(UsuarioController.logar));
usuarioRoutes.post('/usuario/deslogar', asyncExecutor(UsuarioController.deslogar));
usuarioRoutes.post('/usuario/cadastrar', asyncExecutor(UsuarioController.cadastrar));

usuarioRoutes.get('/usuario/perfil', authMiddleware(['USUARIO', 'ADMIN', 'MOTORISTA']), asyncExecutor(UsuarioController.carregarPerfil));
usuarioRoutes.post('/usuario/perfil', authMiddleware(['USUARIO', 'ADMIN', 'MOTORISTA']), upload.single('foto'), asyncExecutor(UsuarioController.atualizarPerfil));
usuarioRoutes.get('/usuario/listar', authMiddleware(['ADMIN']), asyncExecutor(UsuarioController.carregarListar));

usuarioRoutes.get('/foto/:id', authMiddleware(['USUARIO', 'ADMIN', 'MOTORISTA']), asyncExecutor (UsuarioController.foto));
usuarioRoutes.post( '/usuario/perfil/foto/excluir', authMiddleware(['USUARIO', 'ADMIN', 'MOTORISTA']), asyncExecutor(UsuarioController.excluirFoto));




usuarioRoutes.post('/usuario/excluir/:id', authMiddleware(['ADMIN']), asyncExecutor(UsuarioController.excluir));
usuarioRoutes.get('/usuario/editar/:id', authMiddleware(['ADMIN']), asyncExecutor(UsuarioController.carregarEditar));
usuarioRoutes.post('/usuario/editar/:id', authMiddleware(['ADMIN']), asyncExecutor(UsuarioController.editar));

usuarioRoutes.get('/admin/usuario/cadastrar', authMiddleware(['ADMIN']), asyncExecutor(UsuarioController.carregarCadastrar));
usuarioRoutes.post('/admin/usuario/cadastrar', authMiddleware(['ADMIN']), asyncExecutor(UsuarioController.cadastrarInterno));


export {
    usuarioRoutes
}