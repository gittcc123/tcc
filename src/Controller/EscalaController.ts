import { Request, Response } from "express";
import { Escala } from "../Model/Escala";

export class EscalaController {

    static async carregarListar(req: Request, res: Response) {

        const { usuario } = req.session as any;

        const escalas = await Escala.buscarTodos();

        res.render('pages/escala/listar', {
            usuario,
            escalas,
            titulo: 'Listar Escalas',
            mensagem: null
        });

    }

    static async carregarCadastrar(req: Request, res: Response) {

        const { usuario } = req.session as any;

        return res.render('pages/escala/cadastrar', {
            titulo: 'Cadastrar Escala',
            mensagem: null,
            usuario
        });

    }

    static async cadastrar(req: Request, res: Response) {

        const { descricao, turno } = req.body;

        const { usuario } = req.session as any;

        if (!descricao || !turno) {

            return res.render('pages/escala/cadastrar', {
                titulo: 'Cadastrar Escala',
                mensagem: {
                    tipo: 'error',
                    valor: 'Preencha todos os campos corretamente',
                    tituloMensagem: 'Dados inválidos'
                },
                usuario
            });

        }

        const escalaEncontrada = await Escala.buscarPorDescricao(descricao);

        if (escalaEncontrada) {

            return res.render('pages/escala/cadastrar', {
                titulo: 'Cadastrar Escala',
                mensagem: {
                    tipo: 'error',
                    valor: 'Já existe uma escala com essa descrição',
                    tituloMensagem: 'Erro'
                },
                usuario
            });

        }

        const novaEscala: Escala = new Escala({
            descricao,
            turno
        });

        await Escala.cadastrar(novaEscala);

        return res.render('pages/escala/cadastrar', {
            titulo: 'Cadastrar Escala',
            mensagem: {
                tipo: 'success',
                valor: 'Escala cadastrada com sucesso!',
                tituloMensagem: 'Sucesso'
            },
            usuario
        });

    }

    static async carregarEditar(req: Request, res: Response) {

    const { id } = req.params;

    const { usuario } = req.session as any;

    const escalaEncontrada = await Escala.buscarPorId(id);

    if (!escalaEncontrada) {
        throw new Error('Escala não encontrada');
    }

    return res.render('pages/escala/editar', {
        titulo: 'Editar Escala',
        mensagem: null,
        escala: escalaEncontrada,
        usuario
    });

  }

    static async editar(req: Request, res: Response) {

    const { id } = req.params;

    const { descricao, turno } = req.body;

    const { usuario } = req.session as any;

    const escalaEncontrada = await Escala.buscarPorId(id);

    if (!escalaEncontrada) {
        throw new Error('Escala não encontrada');
    }

    if (!descricao || !turno) {

        return res.render('pages/escala/editar', {
            titulo: 'Editar Escala',
            mensagem: {
                tipo: 'error',
                valor: 'Preencha todos os campos corretamente',
                tituloMensagem: 'Dados inválidos'
            },
            escala: escalaEncontrada,
            usuario
        });

    }

    escalaEncontrada.descricao = descricao;
    escalaEncontrada.turno = turno;

    await Escala.atualizar(escalaEncontrada);

    return res.render('pages/escala/editar', {
        titulo: 'Editar Escala',
        mensagem: {
            tipo: 'success',
            valor: 'Dados salvos com sucesso!',
            tituloMensagem: 'Dados da escala'
        },
        escala: escalaEncontrada,
        usuario
    });

}

    static async excluir(req: Request, res: Response) {

        const { id } = req.params;

        await Escala.deletarPorId(id);

        res.redirect('../listar');

    }

    static async carregarPerfil(req: Request, res: Response) {

        const { id } = req.params;

        const { usuario } = req.session as any;

        const escalaEncontrada = await Escala.buscarPorId(id);

        if (!escalaEncontrada) {
            throw new Error('Escala não encontrada');
        }

        return res.render('pages/escala/perfil', {
            titulo: 'Perfil da Escala',
            mensagem: null,
            escala: escalaEncontrada,
            usuario
        });

    }

}