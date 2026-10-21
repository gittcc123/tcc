import { Request, Response } from "express";
import { Alerta } from "../Model/Alertas";
import { LocalizacaoVeiculo } from "../Model/LocalizacaoVeiculo";

export class AlertaController {


    static async carregarListar(
        req: Request,
        res: Response
    ) {

        const { usuario } =
            req.session as any;

        const alertas =
            await Alerta.buscarTodos();

        return res.render(
            "pages/alerta/listar",
            {

                usuario,

                alertas,

                titulo:
                    "Alertas do Sistema",

                mensagem:
                    null

            }
        );
    }




    static async carregarCadastrar(
        req: Request,
        res: Response
    ) {

        const { usuario } =
            req.session as any;

        return res.render(
            "pages/alerta/cadastrar",
            {

                titulo:
                    "Emitir Alerta",

                mensagem:
                    null,

                usuario

            }
        );
    }


 

    static async cadastrar(
        req: Request,
        res: Response
    ) {

        const {
            tipo,
            mensagem,
            status,
            localizacao_id
        } = req.body;

        const { usuario } =
            req.session as any;




        if (
            !tipo ||
            !mensagem ||
            !status
        ) {

            return res.render(
                "pages/alerta/cadastrar",
                {

                    titulo:
                        "Emitir Alerta",

                    mensagem: {

                        tipo:
                            "error",

                        valor:
                            "Preencha todos os campos corretamente.",

                        tituloMensagem:
                            "Dados inválidos"

                    },

                    usuario

                }
            );
        }


        let localizacao:
            LocalizacaoVeiculo | null = null;

        let localizacaoId:
            number | null = null;


        if (
            localizacao_id &&
            String(localizacao_id).trim() !== ""
        ) {

            localizacao =
                await LocalizacaoVeiculo.buscarPorId(
                    localizacao_id
                );


            if (!localizacao) {

                return res.render(
                    "pages/alerta/cadastrar",
                    {

                        titulo:
                            "Emitir Alerta",

                        mensagem: {

                            tipo:
                                "error",

                            valor:
                                "A localização informada não existe.",

                            tituloMensagem:
                                "Erro de localização"

                        },

                        usuario

                    }
                );
            }


            localizacaoId =
                localizacao.id;
        }



        const novoAlerta =
            new Alerta({

                id:
                    0,

                tipo,

                mensagem,

                data_criacao:
                    new Date(),

                status,

                localizacao:
                    localizacao as any

            });


        await Alerta.cadastrar(
            novoAlerta,
            localizacaoId
        );


        return res.render(
            "pages/alerta/cadastrar",
            {

                titulo:
                    "Emitir Alerta",

                mensagem: {

                    tipo:
                        "success",

                    valor:
                        "Alerta emitido com sucesso.",

                    tituloMensagem:
                        "Alerta registrado"

                },

                usuario

            }
        );
    }

    static async carregarEditar(
        req: Request,
        res: Response
    ) {

        const { id } =
            req.params;

        const { usuario } =
            req.session as any;


        const alertaEncontrado =
            await Alerta.buscarPorId(id);


        if (!alertaEncontrado) {

            throw new Error(
                "Alerta não encontrado"
            );
        }


        return res.render(
            "pages/alerta/editar",
            {

                titulo:
                    "Editar Alerta",

                mensagem:
                    null,

                alertaParaEditar:
                    alertaEncontrado,

                usuario

            }
        );
    }

    static async editar(
        req: Request,
        res: Response
    ) {

        const { id } =
            req.params;

        const {
            tipo,
            mensagem,
            status
        } = req.body;

        const { usuario } =
            req.session as any;


        const alertaEncontrado =
            await Alerta.buscarPorId(id);


        if (!alertaEncontrado) {

            throw new Error(
                "Alerta não encontrado"
            );
        }


        alertaEncontrado.tipo =
            tipo;

        alertaEncontrado.mensagem =
            mensagem;

        alertaEncontrado.status =
            status;


        await Alerta.atualizar(
            alertaEncontrado
        );


        return res.render(
            "pages/alerta/editar",
            {

                titulo:
                    "Editar Alerta",

                mensagem: {

                    tipo:
                        "success",

                    valor:
                        "Dados do alerta atualizados com sucesso.",

                    tituloMensagem:
                        "Alerta atualizado"

                },

                alertaParaEditar:
                    alertaEncontrado,

                usuario

            }
        );
    }


    static async excluir(
        req: Request,
        res: Response
    ) {

        const { id } =
            req.params;


        await Alerta.deletarPorId(
            id
        );


        return res.redirect(
            "/alerta/listar"
        );
    }

}