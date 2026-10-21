import { Request, Response } from "express";
import { Cidade } from "../Model/Cidade";
import { Estado } from "../Model/Estado";

export class CidadeController {


    static async carregarListar(req: Request, res: Response) {

        const { usuario } = req.session as any;

        const cidades = await Cidade.buscarTodos();

        return res.render('pages/cidade/listar', {

            usuario,
            cidades,

            titulo: 'Listar Cidades',

            mensagem: null

        });

    }


    static async carregarCadastrar(req: Request, res: Response) {

        const { usuario } = req.session as any;

        const estados = await Estado.buscarTodos();

        return res.render('pages/cidade/cadastrar', {

            titulo: 'Cadastrar Cidade',

            mensagem: null,

            usuario,

            estados

        });

    }


    static async cadastrar(req: Request, res: Response) {

        const {
            nome,
            cep,
            estado_id
        } = req.body;

        const { usuario } = req.session as any;


        if (!nome || !cep || !estado_id) {

            const estados = await Estado.buscarTodos();

            return res.render('pages/cidade/cadastrar', {

                titulo: 'Cadastrar Cidade',

                mensagem: {
                    tipo: 'error',
                    valor: 'Preencha todos os campos corretamente.',
                    tituloMensagem: 'Dados inválidos'
                },

                usuario,
                estados

            });

        }


        const cidadeEncontrada =
            await Cidade.buscarPorNome(nome);


        if (cidadeEncontrada) {

            const estados = await Estado.buscarTodos();

            return res.render('pages/cidade/cadastrar', {

                titulo: 'Cadastrar Cidade',

                mensagem: {
                    tipo: 'error',
                    valor: 'Já existe uma cidade com esse nome.',
                    tituloMensagem: 'Erro'
                },

                usuario,
                estados

            });

        }


        const cidade = new Cidade({

            nome,
            cep,
            estado_id: Number(estado_id)

        });


        await Cidade.cadastrar(cidade);


        const estados = await Estado.buscarTodos();


        return res.render('pages/cidade/cadastrar', {

            titulo: 'Cadastrar Cidade',

            mensagem: {
                tipo: 'success',
                valor: 'Cidade cadastrada com sucesso!',
                tituloMensagem: 'Sucesso'
            },

            usuario,
            estados

        });

    }


    static async carregarEditar(req: Request, res: Response) {

        const { id } = req.params;

        const { usuario } = req.session as any;


        const cidadeEncontrada =
            await Cidade.buscarPorId(id);


        if (!cidadeEncontrada) {

            throw new Error(
                'Cidade não encontrada'
            );

        }


        const estados =
            await Estado.buscarTodos();


        return res.render('pages/cidade/editar', {

            titulo: 'Editar Cidade',

            mensagem: null,

            cidadeParaEditar: cidadeEncontrada,

            estados,

            usuario

        });

    }


    static async editar(req: Request, res: Response) {

        const { id } = req.params;

        const {
            nome,
            cep,
            estado_id
        } = req.body;

        const { usuario } = req.session as any;


        const cidadeEncontrada =
            await Cidade.buscarPorId(id);


        if (!cidadeEncontrada) {

            throw new Error(
                'Cidade não encontrada'
            );

        }


        cidadeEncontrada.nome = nome;

        cidadeEncontrada.cep = cep;

        cidadeEncontrada.estado_id =
            Number(estado_id);


        await Cidade.atualizar(
            cidadeEncontrada
        );


        const estados =
            await Estado.buscarTodos();


        return res.render('pages/cidade/editar', {

            titulo: 'Editar Cidade',

            mensagem: {
                tipo: 'success',
                valor: 'Dados salvos com sucesso!',
                tituloMensagem: 'Dados da cidade'
            },

            cidadeParaEditar: cidadeEncontrada,

            estados,

            usuario

        });

    }


    static async excluir(req: Request, res: Response) {

        const { id } = req.params;


        await Cidade.deletarPorId(id);


        return res.redirect(
            '../listar'
        );

    }


    static async carregarPerfil(req: Request, res: Response) {

        const { id } = req.params;

        const { usuario } = req.session as any;


        const cidadeEncontrada =
            await Cidade.buscarPorId(id);


        if (!cidadeEncontrada) {

            throw new Error(
                'Cidade não encontrada'
            );

        }


        return res.render(
            'pages/cidade/perfil',
            {

                titulo: 'Perfil da Cidade',

                mensagem: null,

                cidade: cidadeEncontrada,

                usuario

            }
        );

    }

}