import { Request, Response } from "express";
import { EscalaMotorista } from "../Model/EscalaMotorista";
import { Motorista } from "../Model/Motorista";
import { Veiculo } from "../Model/Veiculo";
import { Escala } from "../Model/Escala";

export class EscalaMotoristaController {


    static async carregarListar(req: Request, res: Response) {

        const { usuario } = req.session as any;

        const todasEscalas = await EscalaMotorista.buscarTodos();

        let escalasMotorista = todasEscalas;
        
        if (usuario?.tipo === "MOTORISTA") {

            escalasMotorista = todasEscalas.filter(
                escala =>
                    escala.motorista?.usuario?.id === usuario.id
            );

        }

        return res.render("pages/escalaMotorista/listar", {

            titulo: "Escalas dos Motoristas",

            mensagem: null,

            escalasMotorista,

            usuario

        });

    }



    static async carregarCadastrar(req: Request, res: Response) {

        const { usuario } = req.session as any;

        const motoristas = await Motorista.buscarTodos();

        const veiculos = await Veiculo.buscarTodos();

        const escalas = await Escala.buscarTodos();


        return res.render("pages/escalaMotorista/cadastrar", {

            titulo: "Cadastrar Escala do Motorista",

            mensagem: null,

            usuario,

            motoristas,

            veiculos,

            escalas

        });

    }


    static async cadastrar(req: Request, res: Response) {

        const {
            horario_inicio,
            horario_fim,
            motorista_id,
            veiculo_id,
            escala_id
        } = req.body;


        const { usuario } = req.session as any;



        const motoristas = await Motorista.buscarTodos();

        const veiculos = await Veiculo.buscarTodos();

        const escalas = await Escala.buscarTodos();


        if (
            !horario_inicio ||
            !horario_fim ||
            !motorista_id ||
            !veiculo_id ||
            !escala_id
        ) {

            return res.render(
                "pages/escalaMotorista/cadastrar",
                {

                    titulo: "Cadastrar Escala do Motorista",

                    mensagem: {
                        tipo: "error",
                        valor: "Preencha todos os campos corretamente.",
                        titulo: "Erro"
                    },

                    usuario,

                    motoristas,

                    veiculos,

                    escalas

                }
            );

        }


        const motorista = await Motorista.buscarPorId(
            motorista_id
        );



        const veiculo = await Veiculo.buscarPorId(
            veiculo_id
        );



        const escala = await Escala.buscarPorId(
            escala_id
        );



        if (!motorista || !veiculo || !escala) {

            return res.render(
                "pages/escalaMotorista/cadastrar",
                {

                    titulo: "Cadastrar Escala do Motorista",

                    mensagem: {
                        tipo: "error",
                        valor: "Os dados selecionados são inválidos.",
                        titulo: "Erro"
                    },

                    usuario,

                    motoristas,

                    veiculos,

                    escalas

                }
            );

        }



        const dataInicio = new Date(horario_inicio);

        const dataFim = new Date(horario_fim);



        if (
            isNaN(dataInicio.getTime()) ||
            isNaN(dataFim.getTime())
        ) {

            return res.render(
                "pages/escalaMotorista/cadastrar",
                {

                    titulo: "Cadastrar Escala do Motorista",

                    mensagem: {
                        tipo: "error",
                        valor: "A data ou horário informado é inválido.",
                        titulo: "Erro"
                    },

                    usuario,

                    motoristas,

                    veiculos,

                    escalas

                }
            );

        }


        if (dataFim <= dataInicio) {

            return res.render(
                "pages/escalaMotorista/cadastrar",
                {

                    titulo: "Cadastrar Escala do Motorista",

                    mensagem: {
                        tipo: "error",
                        valor: "O horário de término deve ser posterior ao horário de início.",
                        titulo: "Erro"
                    },

                    usuario,

                    motoristas,

                    veiculos,

                    escalas

                }
            );

        }


        const novaEscalaMotorista = new EscalaMotorista({

            id: 0,

            horario_inicio: dataInicio,

            horario_fim: dataFim,

            motorista,

            veiculo,

            escala

        });


        try {

            await EscalaMotorista.cadastrar(
                novaEscalaMotorista
            );


            return res.render(
                "pages/escalaMotorista/cadastrar",
                {

                    titulo: "Cadastrar Escala do Motorista",

                    mensagem: {
                        tipo: "success",
                        valor: "Escala cadastrada com sucesso!",
                        titulo: "Sucesso"
                    },

                    usuario,

                    motoristas,

                    veiculos,

                    escalas

                }
            );


        } catch (error: any) {

            console.error(
                "Erro ao cadastrar escala:",
                error
            );


            let mensagemErro =
                "Não foi possível cadastrar a escala.";


            if (
                error?.message ===
                "Este motorista já está utilizando este veículo neste dia."
            ) {

                mensagemErro =
                    "Este motorista já está utilizando este veículo neste dia.";

            }


            return res.render(
                "pages/escalaMotorista/cadastrar",
                {

                    titulo: "Cadastrar Escala do Motorista",

                    mensagem: {
                        tipo: "error",
                        valor: mensagemErro,
                        titulo: "Erro"
                    },

                    usuario,

                    motoristas,

                    veiculos,

                    escalas

                }
            );

        }

    }


    static async carregarEditar(
        req: Request,
        res: Response
    ) {

        const { id } = req.params;

        const { usuario } = req.session as any;


        const escalaMotorista =
            await EscalaMotorista.buscarPorId(id);


        if (!escalaMotorista) {

            return res
                .status(404)
                .send("Escala do motorista não encontrada");

        }


        const motoristas =
            await Motorista.buscarTodos();

        const veiculos =
            await Veiculo.buscarTodos();

        const escalas =
            await Escala.buscarTodos();


        return res.render(
            "pages/escalaMotorista/editar",
            {

                titulo: "Editar Escala do Motorista",

                mensagem: null,

                escalaMotorista,

                usuario,

                motoristas,

                veiculos,

                escalas

            }
        );

    }


    static async editar(
        req: Request,
        res: Response
    ) {

        const { id } = req.params;


        const {
            horario_inicio,
            horario_fim,
            motorista_id,
            veiculo_id,
            escala_id
        } = req.body;


        const { usuario } = req.session as any;



        const escalaMotorista =
            await EscalaMotorista.buscarPorId(id);


        if (!escalaMotorista) {

            return res
                .status(404)
                .send("Escala do motorista não encontrada");

        }



        const motoristas =
            await Motorista.buscarTodos();

        const veiculos =
            await Veiculo.buscarTodos();

        const escalas =
            await Escala.buscarTodos();



        if (
            !horario_inicio ||
            !horario_fim ||
            !motorista_id ||
            !veiculo_id ||
            !escala_id
        ) {

            return res.render(
                "pages/escalaMotorista/editar",
                {

                    titulo: "Editar Escala do Motorista",

                    mensagem: {
                        tipo: "error",
                        valor: "Preencha todos os campos corretamente.",
                        titulo: "Erro"
                    },

                    escalaMotorista,

                    usuario,

                    motoristas,

                    veiculos,

                    escalas

                }
            );

        }


        const motorista =
            await Motorista.buscarPorId(
                motorista_id
            );



        const veiculo =
            await Veiculo.buscarPorId(
                veiculo_id
            );



        const escala =
            await Escala.buscarPorId(
                escala_id
            );


        if (!motorista || !veiculo || !escala) {

            return res.render(
                "pages/escalaMotorista/editar",
                {

                    titulo: "Editar Escala do Motorista",

                    mensagem: {
                        tipo: "error",
                        valor: "Os dados selecionados são inválidos.",
                        titulo: "Erro"
                    },

                    escalaMotorista,

                    usuario,

                    motoristas,

                    veiculos,

                    escalas

                }
            );

        }



        const dataInicio =
            new Date(horario_inicio);

        const dataFim =
            new Date(horario_fim);



        if (
            isNaN(dataInicio.getTime()) ||
            isNaN(dataFim.getTime())
        ) {

            return res.render(
                "pages/escalaMotorista/editar",
                {

                    titulo: "Editar Escala do Motorista",

                    mensagem: {
                        tipo: "error",
                        valor: "A data ou horário informado é inválido.",
                        titulo: "Erro"
                    },

                    escalaMotorista,

                    usuario,

                    motoristas,

                    veiculos,

                    escalas

                }
            );

        }


        if (dataFim <= dataInicio) {

            return res.render(
                "pages/escalaMotorista/editar",
                {

                    titulo: "Editar Escala do Motorista",

                    mensagem: {
                        tipo: "error",
                        valor: "O horário de término deve ser posterior ao horário de início.",
                        titulo: "Erro"
                    },

                    escalaMotorista,

                    usuario,

                    motoristas,

                    veiculos,

                    escalas

                }
            );

        }



        escalaMotorista.horario_inicio =
            dataInicio;

        escalaMotorista.horario_fim =
            dataFim;

        escalaMotorista.motorista =
            motorista;

        escalaMotorista.veiculo =
            veiculo;

        escalaMotorista.escala =
            escala;



        try {

            await EscalaMotorista.atualizar(
                escalaMotorista
            );


            return res.redirect(
                "/escalamotorista/listar"
            );


        } catch (error: any) {

            console.error(
                "Erro ao editar escala:",
                error
            );


            let mensagemErro =
                "Não foi possível atualizar a escala.";


            if (
                error?.message ===
                "Este motorista já está utilizando este veículo neste dia."
            ) {

                mensagemErro =
                    "Este motorista já está utilizando este veículo neste dia.";

            }


            return res.render(
                "pages/escalaMotorista/editar",
                {

                    titulo: "Editar Escala do Motorista",

                    mensagem: {
                        tipo: "error",
                        valor: mensagemErro,
                        titulo: "Erro"
                    },

                    escalaMotorista,

                    usuario,

                    motoristas,

                    veiculos,

                    escalas

                }
            );

        }

    }



    static async excluir(
        req: Request,
        res: Response
    ) {

        const { id } = req.params;


        try {

            await EscalaMotorista.deletarPorId(id);

            return res.redirect(
                "/escalamotorista/listar"
            );

        } catch (error) {

            console.error(
                "Erro ao excluir escala:",
                error
            );

            return res
                .status(500)
                .send("Não foi possível excluir a escala.");

        }

    }

}