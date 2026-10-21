import { Request, Response } from "express";
import { Motorista } from "../Model/Motorista";
import { Usuario } from "../Model/Usuario";

export class MotoristaController {

    static async carregarListar(req: Request, res: Response) {

        const { usuario } = req.session as any;

        const motoristas = await Motorista.buscarTodos();

        return res.render("pages/motorista/listar", {
            titulo: "Listar Motoristas",
            motoristas,
            usuario,
            mensagem: null
        });

    }

    static async carregarCadastrar(req: Request, res: Response) {

        const { usuario } = req.session as any;

        const usuarios = await Motorista.buscarUsuariosParaMotorista();

        return res.render("pages/motorista/cadastrar", {
            titulo: "Cadastrar Motorista",
            usuario,
            usuarios,
            mensagem: null
        });

    }

    static async cadastrar(req: Request, res: Response) {

        const {
            usuario_id,
            telefone,
            ativo
        } = req.body;

        const { usuario } = req.session as any;

        /*
         * Validação dos campos.
         */
        if (!usuario_id || !telefone) {

            const usuarios =
                await Motorista.buscarUsuariosParaMotorista();

            return res.render("pages/motorista/cadastrar", {
                titulo: "Cadastrar Motorista",
                usuarios,
                usuario,
                mensagem: {
                    tipo: "error",
                    tituloMensagem: "Dados inválidos",
                    valor: "Preencha todos os campos corretamente."
                }
            });

        }

        const usuarioId = Number(usuario_id);

        /*
         * Verifica se o usuário existe.
         */
        const usuarioEncontrado =
            await Usuario.buscarPorId(usuarioId);

        if (!usuarioEncontrado) {

            const usuarios =
                await Motorista.buscarUsuariosParaMotorista();

            return res.render("pages/motorista/cadastrar", {
                titulo: "Cadastrar Motorista",
                usuarios,
                usuario,
                mensagem: {
                    tipo: "error",
                    tituloMensagem: "Usuário não encontrado",
                    valor: "O usuário selecionado não existe."
                }
            });

        }

        /*
         * Não permite ADMIN ser motorista.
         */
        if (
            usuarioEncontrado.tipo &&
            usuarioEncontrado.tipo.nome === "ADMIN"
        ) {

            const usuarios =
                await Motorista.buscarUsuariosParaMotorista();

            return res.render("pages/motorista/cadastrar", {
                titulo: "Cadastrar Motorista",
                usuarios,
                usuario,
                mensagem: {
                    tipo: "error",
                    tituloMensagem: "Usuário inválido",
                    valor: "Um usuário ADMIN não pode ser cadastrado como motorista."
                }
            });

        }

        /*
         * Não permite que o usuário logado
         * seja cadastrado como motorista dele mesmo.
         */
        if (Number(usuario.id) === usuarioId) {

            const usuarios =
                await Motorista.buscarUsuariosParaMotorista();

            return res.render("pages/motorista/cadastrar", {
                titulo: "Cadastrar Motorista",
                usuarios,
                usuario,
                mensagem: {
                    tipo: "error",
                    tituloMensagem: "Usuário inválido",
                    valor: "Você não pode cadastrar seu próprio usuário como motorista."
                }
            });

        }

        /*
         * VERIFICAÇÃO PRINCIPAL:
         * verifica se esse usuário já possui
         * um cadastro na tabela motorista.
         */
        const motoristaExistente =
            await Motorista.buscarPorUsuarioId(usuarioId);

        if (motoristaExistente) {

            const usuarios =
                await Motorista.buscarUsuariosParaMotorista();

            return res.render("pages/motorista/cadastrar", {
                titulo: "Cadastrar Motorista",
                usuarios,
                usuario,
                mensagem: {
                    tipo: "error",
                    tituloMensagem: "Motorista já cadastrado",
                    valor: "Este usuário já está cadastrado como motorista."
                }
            });

        }

        /*
         * Cria o objeto motorista.
         */
        const novoMotorista = new Motorista({

            id: 0,

            usuario: usuarioEncontrado,

            telefone: telefone.trim(),

            ativo: ativo === "true"

        });

        /*
         * Salva no banco.
         */
        try {

            await Motorista.cadastrar(novoMotorista);

        } catch (erro: any) {

            /*
             * Proteção adicional caso o banco
             * encontre uma duplicidade através
             * da constraint UNIQUE.
             */
            if (erro.code === "23505") {

                const usuarios =
                    await Motorista.buscarUsuariosParaMotorista();

                return res.render("pages/motorista/cadastrar", {
                    titulo: "Cadastrar Motorista",
                    usuarios,
                    usuario,
                    mensagem: {
                        tipo: "error",
                        tituloMensagem: "Motorista já cadastrado",
                        valor: "Este usuário já está cadastrado como motorista."
                    }
                });

            }

            console.error("Erro ao cadastrar motorista:", erro);

            const usuarios =
                await Motorista.buscarUsuariosParaMotorista();

            return res.render("pages/motorista/cadastrar", {
                titulo: "Cadastrar Motorista",
                usuarios,
                usuario,
                mensagem: {
                    tipo: "error",
                    tituloMensagem: "Erro ao cadastrar",
                    valor: "Não foi possível cadastrar o motorista."
                }
            });

        }

        /*
         * Recarrega os usuários para que
         * o recém-cadastrado apareça como
         * "Motorista já cadastrado".
         */
        const usuarios =
            await Motorista.buscarUsuariosParaMotorista();

        return res.render("pages/motorista/cadastrar", {
            titulo: "Cadastrar Motorista",
            usuarios,
            usuario,
            mensagem: {
                tipo: "success",
                tituloMensagem: "Sucesso",
                valor: "Motorista cadastrado com sucesso!"
            }
        });

    }

    static async carregarEditar(req: Request, res: Response) {

        const { id } = req.params;

        const { usuario } = req.session as any;

        const motoristaEncontrado =
            await Motorista.buscarPorId(id);

        if (!motoristaEncontrado) {
            throw new Error("Motorista não encontrado");
        }

        const usuarios =
            await Motorista.buscarUsuariosParaMotorista();

        return res.render("pages/motorista/editar", {
            titulo: "Editar Motorista",
            motoristaParaEditar: motoristaEncontrado,
            usuarios,
            usuario,
            mensagem: null
        });

    }

    static async editar(req: Request, res: Response) {

        const { id } = req.params;

        const {
            usuario_id,
            telefone,
            ativo
        } = req.body;

        const { usuario } = req.session as any;

        const motoristaEncontrado =
            await Motorista.buscarPorId(id);

        if (!motoristaEncontrado) {
            throw new Error("Motorista não encontrado");
        }

        const usuarioId = Number(usuario_id);

        /*
         * Verifica se o usuário selecionado existe.
         */
        const usuarioEncontrado =
            await Usuario.buscarPorId(usuarioId);

        if (!usuarioEncontrado) {

            const usuarios =
                await Motorista.buscarUsuariosParaMotorista();

            return res.render("pages/motorista/editar", {
                titulo: "Editar Motorista",
                motoristaParaEditar: motoristaEncontrado,
                usuarios,
                usuario,
                mensagem: {
                    tipo: "error",
                    tituloMensagem: "Usuário não encontrado",
                    valor: "O usuário selecionado não existe."
                }
            });

        }

        /*
         * ADMIN não pode ser motorista.
         */
        if (
            usuarioEncontrado.tipo &&
            usuarioEncontrado.tipo.nome === "ADMIN"
        ) {

            const usuarios =
                await Motorista.buscarUsuariosParaMotorista();

            return res.render("pages/motorista/editar", {
                titulo: "Editar Motorista",
                motoristaParaEditar: motoristaEncontrado,
                usuarios,
                usuario,
                mensagem: {
                    tipo: "error",
                    tituloMensagem: "Usuário inválido",
                    valor: "Um usuário ADMIN não pode ser cadastrado como motorista."
                }
            });

        }

        /*
         * Verifica se outro motorista já utiliza
         * esse usuário.
         *
         * Ignora o próprio motorista que está
         * sendo editado.
         */
        const outroMotorista =
            await Motorista.buscarPorUsuarioIdIgnorandoMotorista(
                usuarioId,
                Number(id)
            );

        if (outroMotorista) {

            const usuarios =
                await Motorista.buscarUsuariosParaMotorista();

            return res.render("pages/motorista/editar", {
                titulo: "Editar Motorista",
                motoristaParaEditar: motoristaEncontrado,
                usuarios,
                usuario,
                mensagem: {
                    tipo: "error",
                    tituloMensagem: "Motorista já cadastrado",
                    valor: "Este usuário já está vinculado a outro motorista."
                }
            });

        }

        /*
         * Atualiza os dados.
         */
        motoristaEncontrado.usuario = usuarioEncontrado;
        motoristaEncontrado.telefone = telefone.trim();
        motoristaEncontrado.ativo = ativo === "true";

        try {

            await Motorista.atualizar(motoristaEncontrado);

        } catch (erro: any) {

            if (erro.code === "23505") {

                const usuarios =
                    await Motorista.buscarUsuariosParaMotorista();

                return res.render("pages/motorista/editar", {
                    titulo: "Editar Motorista",
                    motoristaParaEditar: motoristaEncontrado,
                    usuarios,
                    usuario,
                    mensagem: {
                        tipo: "error",
                        tituloMensagem: "Motorista já cadastrado",
                        valor: "Este usuário já está vinculado a outro motorista."
                    }
                });

            }

            console.error("Erro ao atualizar motorista:", erro);

            const usuarios =
                await Motorista.buscarUsuariosParaMotorista();

            return res.render("pages/motorista/editar", {
                titulo: "Editar Motorista",
                motoristaParaEditar: motoristaEncontrado,
                usuarios,
                usuario,
                mensagem: {
                    tipo: "error",
                    tituloMensagem: "Erro ao atualizar",
                    valor: "Não foi possível atualizar o motorista."
                }
            });

        }

        const usuarios =
            await Motorista.buscarUsuariosParaMotorista();

        return res.render("pages/motorista/editar", {
            titulo: "Editar Motorista",
            motoristaParaEditar: motoristaEncontrado,
            usuarios,
            usuario,
            mensagem: {
                tipo: "success",
                tituloMensagem: "Sucesso",
                valor: "Motorista atualizado com sucesso!"
            }
        });

    }

    static async excluir(req: Request, res: Response) {

        const { id } = req.params;

        await Motorista.deletarPorId(id);

        return res.redirect("../listar");

    }

}
