
import { Request, Response } from "express";
import { Veiculo } from "../Model/Veiculo";

export class VeiculoController {


    static carregarLogin(req: Request, res: Response) {

        res.render("login", {
            titulo: "Login",
            mensagem: null
        });

    }


    static async carregarListar(req: Request, res: Response) {

        const { usuario } = req.session as any;

        const veiculos = await Veiculo.buscarTodos();

        res.render("pages/veiculo/listar", {
            usuario,
            veiculos,
            titulo: "Listar Veículos",
            mensagem: null
        });

    }



    static async carregarCadastrar(req: Request, res: Response) {

        const { usuario } = req.session as any;

        res.render("pages/veiculo/cadastrar", {
            usuario,
            titulo: "Cadastro de Veículo",
            mensagem: null
        });

    }


    static async cadastrar(req: Request, res: Response) {

        const { usuario } = req.session as any;

        const {
            status_veiculo,
            capacidade_veiculo,
            placa,
            numero_veiculo
        } = req.body;



        if (
            status_veiculo === undefined ||
            !capacidade_veiculo ||
            !placa ||
            !numero_veiculo
        ) {

            return res.render("pages/veiculo/cadastrar", {

                usuario,

                titulo: "Cadastrar Veículo",

                mensagem: {
                    tipo: "error",
                    valor: "Preencha corretamente todos os dados do veículo.",
                    tituloMensagem: "Dados inválidos"
                }

            });

        }



        const novoVeiculo = new Veiculo({

            status_veiculo,
            capacidade_veiculo,
            placa,
            numero_veiculo

        });


        

        await Veiculo.cadastrar(novoVeiculo);


        

        return res.render("pages/veiculo/cadastrar", {

            usuario,

            titulo: "Cadastrar Veículo",

            mensagem: {
                tipo: "success",
                valor: "Veículo cadastrado com sucesso!",
                tituloMensagem: "Sucesso"
            }

        });

    }

    static async logar(req: Request, res: Response) {

        return res.redirect("/dashboard");

    }


    static async deslogar(req: Request, res: Response) {

        req.session.destroy(() => {

            res.redirect("/usuario/logar");

        });

    }


   

    static carregarVeiculos(req: Request, res: Response) {

        const { veiculo } = req.session as any;

        res.render("veiculos", {
            veiculo
        });

    }



    static async carregarPerfil(req: Request, res: Response) {

        const { veiculo } = req.session as any;

        if (!veiculo) {
            return res.redirect("/veiculo/listar");
        }


        const veiculoEncontrado =
            await Veiculo.buscarPorId(veiculo.id);


        if (!veiculoEncontrado) {

            return res.redirect("/veiculo/listar");

        }


        res.render("pages/veiculo/perfil", {

            veiculo,
            veiculoPerfil: veiculoEncontrado,

            titulo: "Perfil do Veículo",

            mensagem: null

        });

    }



    static async atualizarPerfil(req: Request, res: Response) {

        const { veiculo } = req.session as any;

        if (!veiculo) {
            return res.redirect("/veiculo/listar");
        }


        const {
            status_veiculo,
            capacidade_veiculo,
            placa,
            numero_veiculo
        } = req.body;


        const veiculoEncontrado =
            await Veiculo.buscarPorId(veiculo.id);


        if (!veiculoEncontrado) {

            return res.redirect("/veiculo/listar");

        }


        if (
            status_veiculo === undefined ||
            !capacidade_veiculo ||
            !placa ||
            !numero_veiculo
        ) {

            return res.render("pages/veiculo/perfil", {

                veiculo: veiculoEncontrado,

                titulo: "Perfil do Veículo",

                mensagem: {
                    tipo: "error",
                    valor: "Preencha todos os campos corretamente.",
                    tituloMensagem: "Dados inválidos"
                }

            });

        }


        veiculoEncontrado.status_veiculo =
            status_veiculo;

        veiculoEncontrado.capacidade_veiculo =
            capacidade_veiculo;

        veiculoEncontrado.placa =
            placa;

        veiculoEncontrado.numero_veiculo =
            numero_veiculo;


        await Veiculo.atualizar(
            veiculoEncontrado
        );


        (req.session as any).veiculo = {

            id: veiculoEncontrado.id,

            placa: veiculoEncontrado.placa

        };


        return res.render("pages/veiculo/perfil", {

            veiculo: veiculoEncontrado,

            titulo: "Perfil do Veículo",

            mensagem: {
                tipo: "success",
                valor: "Perfil atualizado com sucesso!",
                tituloMensagem: "Sucesso"
            }

        });

    }


  
    static async excluir(req: Request, res: Response) {

        const { id } = req.params;

        await Veiculo.deletarPorId(id);

        return res.redirect("/veiculo/listar");

    }



    static async carregarEditar(req: Request, res: Response) {

        const { id } = req.params;

        const { veiculo, usuario } =
            req.session as any;


        const veiculoEncontrado =
            await Veiculo.buscarPorId(id);


        if (!veiculoEncontrado) {

            throw new Error(
                "Veículo não encontrado"
            );

        }


        return res.render(
            "pages/veiculo/editar",
            {

                usuario,

                titulo: "Editar Veículo",

                mensagem: null,

                veiculoParaEditar:
                    veiculoEncontrado,

                veiculo

            }
        );

    }



    static async cadastrarInterno(
        req: Request,
        res: Response
    ) {

        const {
            status_veiculo,
            capacidade_veiculo,
            placa,
            numero_veiculo
        } = req.body;


        const {
            veiculo,
            usuario
        } = req.session as any;


        if (
            status_veiculo === undefined ||
            !capacidade_veiculo ||
            !placa ||
            !numero_veiculo
        ) {

            return res.render(
                "pages/veiculo/cadastrar",
                {

                    usuario,

                    titulo: "Cadastrar Veículo",

                    mensagem: {
                        tipo: "error",
                        valor:
                            "Preencha todos os campos corretamente.",
                        tituloMensagem:
                            "Dados inválidos"
                    },

                    veiculo

                }
            );

        }


        const novoVeiculo =
            new Veiculo({

                status_veiculo,
                capacidade_veiculo,
                placa,
                numero_veiculo

            });


        await Veiculo.cadastrar(
            novoVeiculo
        );


        return res.render(
            "pages/veiculo/cadastrar",
            {

                usuario,

                titulo:
                    "Cadastrar Veículo",

                mensagem: {
                    tipo: "success",
                    valor:
                        "Veículo cadastrado com sucesso!",
                    tituloMensagem:
                        "Sucesso"
                },

                veiculo

            }
        );

    }

    static async editar(req: Request, res: Response) {

        const { id } = req.params;

        const {
            status_veiculo,
            capacidade_veiculo,
            placa,
            numero_veiculo
        } = req.body;


        const {
            veiculo,
            usuario
        } = req.session as any;


        const veiculoEncontrado =
            await Veiculo.buscarPorId(id);


        if (!veiculoEncontrado) {

            throw new Error(
                "Veículo não encontrado"
            );

        }


        veiculoEncontrado.status_veiculo =
            status_veiculo;

        veiculoEncontrado.capacidade_veiculo =
            capacidade_veiculo;

        veiculoEncontrado.placa =
            placa;

        veiculoEncontrado.numero_veiculo =
            numero_veiculo;


        await Veiculo.atualizar(
            veiculoEncontrado
        );


        return res.render(
            "pages/veiculo/editar",
            {

                usuario,

                titulo:
                    "Editar Veículo",

                mensagem: {
                    tipo: "success",
                    valor:
                        "Dados salvos com sucesso!",
                    tituloMensagem:
                        "Dados do veículo"
                },

                veiculoParaEditar:
                    veiculoEncontrado,

                veiculo

            }
        );

    }

}
