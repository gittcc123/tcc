import { Request, Response } from "express";
import { Estado } from "../Model/Estado";

export class EstadoController {


    static async carregarListar(req: Request, res: Response) {

        const { usuario } = req.session as any;

        const estados = await Estado.buscarTodos();

        return res.render("pages/estado/listar", {
            usuario,
            estados,
            titulo: "Listar Estados",
            mensagem: null
        });

    }


    static async carregarCadastrar(req: Request, res: Response) {

        const { usuario } = req.session as any;

        return res.render("pages/estado/cadastrar", {
            titulo: "Cadastrar Estado",
            mensagem: null,
            usuario
        });

    }


    static async cadastrar(req: Request, res: Response) {

        const {
            nome,
            sigla_estado
        } = req.body;

        const { usuario } = req.session as any;


        if (!nome || !sigla_estado) {

            return res.render("pages/estado/cadastrar", {

                titulo: "Cadastrar Estado",

                mensagem: {
                    tipo: "error",
                    valor: "Preencha todos os campos corretamente",
                    tituloMensagem: "Dados inválidos"
                },

                usuario

            });

        }


        const estadoEncontrado =
            await Estado.buscarPorSigla(sigla_estado);


        if (estadoEncontrado) {

            return res.render("pages/estado/cadastrar", {

                titulo: "Cadastrar Estado",

                mensagem: {
                    tipo: "error",
                    valor: "Já existe um estado com essa sigla",
                    tituloMensagem: "Erro"
                },

                usuario

            });

        }


        const novoEstado = new Estado({

            nome,
            sigla_estado

        });


        await Estado.cadastrar(novoEstado);


        return res.render("pages/estado/cadastrar", {

            titulo: "Cadastrar Estado",

            mensagem: {
                tipo: "success",
                valor: "Estado cadastrado com sucesso!",
                tituloMensagem: "Sucesso"
            },

            usuario

        });

    }


    static async carregarEditar(req: Request, res: Response) {

        const { id } = req.params;

        const { usuario } = req.session as any;


        const estadoEncontrado =
            await Estado.buscarPorId(id);


        if (!estadoEncontrado) {

            throw new Error("Estado não encontrado");

        }


        return res.render("pages/estado/editar", {

            titulo: "Editar Estado",

            mensagem: null,

            estadoParaEditar: estadoEncontrado,

            usuario

        });

    }


    static async editar(req: Request, res: Response) {

        const { id } = req.params;

        const {
            nome,
            sigla_estado
        } = req.body;

        const { usuario } = req.session as any;


        const estadoEncontrado =
            await Estado.buscarPorId(id);


        if (!estadoEncontrado) {

            throw new Error("Estado não encontrado");

        }


        if (!nome || !sigla_estado) {

            return res.render("pages/estado/editar", {

                titulo: "Editar Estado",

                mensagem: {
                    tipo: "error",
                    valor: "Preencha todos os campos corretamente",
                    tituloMensagem: "Dados inválidos"
                },

                estadoParaEditar: estadoEncontrado,

                usuario

            });

        }


        estadoEncontrado.nome = nome;

        estadoEncontrado.sigla_estado = sigla_estado;


        await Estado.atualizar(estadoEncontrado);


        return res.render("pages/estado/editar", {

            titulo: "Editar Estado",

            mensagem: {
                tipo: "success",
                valor: "Dados salvos com sucesso!",
                tituloMensagem: "Dados do estado"
            },

            estadoParaEditar: estadoEncontrado,

            usuario

        });

    }


    static async excluir(req: Request, res: Response) {

        const { id } = req.params;

        await Estado.deletarPorId(id);

        return res.redirect("../listar");

    }


    static async carregarPerfil(req: Request, res: Response) {

        const { id } = req.params;

        const { usuario } = req.session as any;


        const estadoEncontrado =
            await Estado.buscarPorId(id);


        if (!estadoEncontrado) {

            throw new Error("Estado não encontrado");

        }


        return res.render("pages/estado/perfil", {

            titulo: "Perfil do Estado",

            mensagem: null,

            estado: estadoEncontrado,

            usuario

        });

    }

}

