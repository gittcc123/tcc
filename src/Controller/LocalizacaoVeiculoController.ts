import { Request, Response } from "express";
import { LocalizacaoVeiculo } from "../Model/LocalizacaoVeiculo";
import { Veiculo } from "../Model/Veiculo";
import { Rota } from "../Model/Rota";


export class LocalizacaoVeiculoController {



    static async carregarListar(req: Request, res: Response) {

        const { usuario } = req.session as any;

        const localizacoes =
            await LocalizacaoVeiculo.buscarTodos();

        const rotas =
            await Rota.buscarTodos();


        return res.render(
            "pages/localizacaoVeiculo/listar",
            {
                usuario,
                localizacoes,
                rotas,
                titulo: "Monitoramento em Tempo Real",
                mensagem: null
            }
        );

    }

    static async carregarCadastrar(req: Request, res: Response) {

        const { usuario } = req.session as any;

        const veiculos =
            await Veiculo.buscarTodos();


        return res.render(
            "pages/localizacaoVeiculo/cadastrar",
            {
                titulo: "Cadastrar Localização",
                mensagem: null,
                usuario,
                veiculos
            }
        );

    }

    static async cadastrar(req: Request, res: Response) {

        const {
            latitude,
            longitude,
            data_hora,
            veiculo_id
        } = req.body;


        const { usuario } =
            req.session as any;

        const veiculos =
            await Veiculo.buscarTodos();

        if (
            latitude === undefined ||
            latitude === "" ||
            longitude === undefined ||
            longitude === "" ||
            !veiculo_id
        ) {

            return res.render(
                "pages/localizacaoVeiculo/cadastrar",
                {
                    titulo: "Cadastrar Localização",

                    mensagem: {
                        tipo: "error",
                        valor: "Preencha todos os campos corretamente.",
                        tituloMensagem: "Dados inválidos"
                    },

                    usuario,
                    veiculos
                }
            );

        }

        const veiculo =
            await Veiculo.buscarPorId(veiculo_id);


        if (!veiculo) {

            return res.render(
                "pages/localizacaoVeiculo/cadastrar",
                {
                    titulo: "Cadastrar Localização",

                    mensagem: {
                        tipo: "error",
                        valor: "O veículo selecionado não foi encontrado.",
                        tituloMensagem: "Erro"
                    },

                    usuario,
                    veiculos
                }
            );

        }


        const novaLocalizacao =
            new LocalizacaoVeiculo({

                id: 0,

                latitude:
                    Number(latitude),

                longitude:
                    Number(longitude),

                data_hora:
                    data_hora
                        ? new Date(data_hora)
                        : new Date(),

                veiculo

            });



        await LocalizacaoVeiculo.cadastrar(
            novaLocalizacao
        );



        return res.render(
            "pages/localizacaoVeiculo/cadastrar",
            {
                titulo: "Cadastrar Localização",

                mensagem: {
                    tipo: "success",
                    valor: "Localização cadastrada com sucesso!",
                    tituloMensagem: "Sucesso"
                },

                usuario,
                veiculos
            }
        );

    }


    static async carregarEditar(req: Request, res: Response) {

        const { id } =
            req.params;

        const { usuario } =
            req.session as any;


        const localizacaoEncontrada =
            await LocalizacaoVeiculo.buscarPorId(id);


        if (!localizacaoEncontrada) {

            throw new Error(
                "Localização não encontrada"
            );

        }


        return res.render(
            "pages/localizacaoVeiculo/editar",
            {
                titulo: "Editar Localização",

                mensagem: null,

                localizacaoParaEditar:
                    localizacaoEncontrada,

                usuario
            }
        );

    }
    static async editar(req: Request, res: Response) {

        const { id } =
            req.params;


        const {
            latitude,
            longitude,
            data_hora
        } = req.body;


        const { usuario } =
            req.session as any;


        const localizacaoEncontrada =
            await LocalizacaoVeiculo.buscarPorId(id);


        if (!localizacaoEncontrada) {

            throw new Error(
                "Localização não encontrada"
            );

        }


        localizacaoEncontrada.latitude =
            Number(latitude);

        localizacaoEncontrada.longitude =
            Number(longitude);

        localizacaoEncontrada.data_hora =
            new Date(data_hora);


        await LocalizacaoVeiculo.atualizar(
            localizacaoEncontrada
        );


        return res.render(
            "pages/localizacaoVeiculo/editar",
            {
                titulo: "Editar Localização",

                mensagem: {
                    tipo: "success",
                    valor: "Dados salvos com sucesso!",
                    tituloMensagem: "Dados da localização"
                },

                localizacaoParaEditar:
                    localizacaoEncontrada,

                usuario
            }
        );

    }

    static async excluir(req: Request, res: Response) {

        const { id } =
            req.params;


        await LocalizacaoVeiculo.deletarPorId(id);


        return res.redirect("../listar");

    }

} 