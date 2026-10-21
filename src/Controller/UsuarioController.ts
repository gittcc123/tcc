import { Request, Response } from "express";
import { Usuario } from "../Model/Usuario";
import { TipoUsuario } from "../Model/TipoUsuario";
import { TipoUsuarioEnum } from "../Enums/TipoUsuario";

import fs from "fs";
import path from "path";


export class UsuarioController {


    static carregarLogin(req: Request, res: Response) {

        return res.render("login", {
            mensagem: null
        });

    }


    static async carregarListar(
        req: Request,
        res: Response
    ) {

        const { usuario } =
            req.session as any;

        const usuarios =
            await Usuario.buscarTodos();

        return res.render(
            "pages/usuario/listar",
            {
                usuario,
                usuarios,
                titulo: "Listar Usuários",
                mensagem: null
            }
        );
    }

    static async cadastrar(
        req: Request,
        res: Response
    ) {

        const {
            nome,
            email,
            senha
        } = req.body;


        if (
            !nome ||
            !email ||
            !senha
        ) {

            return res.render(
                "login",
                {
                    mensagem: {
                        tipo: "error",
                        valor:
                            "Preencha corretamente os dados!",
                        titulo:
                            "Dados inválidos"
                    }
                }
            );
        }


        const usuarioEncontrado =
            await Usuario.buscarPorEmail(
                email
            );


        if (usuarioEncontrado) {

            return res.render(
                "login",
                {
                    mensagem: {
                        tipo: "error",
                        valor:
                            "E-mail já existe",
                        titulo:
                            "Erro"
                    }
                }
            );
        }


        const tipoPadrao =
            await TipoUsuario.buscarPorNome(
                TipoUsuarioEnum.USUARIO
            );


        if (!tipoPadrao) {

            return res.render(
                "login",
                {
                    mensagem: {
                        tipo: "error",
                        valor:
                            "Tipo de usuário padrão não encontrado",
                        titulo:
                            "Erro do sistema"
                    }
                }
            );
        }


        const novoUsuario =
            new Usuario({

                id: 0,

                nome,

                email,

                senha,

                tipo: tipoPadrao

            });


        await Usuario.cadastrar(
            novoUsuario
        );


        return res.render(
            "login",
            {
                mensagem: {
                    tipo: "success",
                    valor:
                        "Usuário cadastrado com sucesso!",
                    titulo:
                        "Sucesso"
                }
            }
        );
    }



    static async logar(
        req: Request,
        res: Response
    ) {

        const {
            email,
            senha
        } = req.body;


        if (
            !email ||
            !senha
        ) {

            return res.render(
                "login",
                {
                    mensagem: {
                        tipo: "error",
                        valor:
                            "Preencha todos os campos corretamente",
                        titulo:
                            "Dados inválidos"
                    }
                }
            );
        }


        const usuario =
            await Usuario.buscarPorEmailESenha(
                email,
                senha
            );


        if (!usuario) {

            return res.render(
                "login",
                {
                    mensagem: {
                        tipo: "error",
                        valor:
                            "E-mail ou senha incorretos",
                        titulo:
                            "Erro"
                    }
                }
            );
        }


        (req.session as any).usuario = {

            id:
                usuario.id,

            nome:
                usuario.nome,

            email:
                usuario.email,

            tipo:
                usuario.tipo.nome

        };


        return res.redirect(
            "/dashboard"
        );
    }


    static async deslogar(
        req: Request,
        res: Response
    ) {

        req.session.destroy(() => {

            res.redirect(
                "/usuario/logar"
            );

        });
    }


    static async carregarPerfil(
        req: Request,
        res: Response
    ) {

        const { usuario } =
            req.session as any;


        if (!usuario) {

            return res.redirect(
                "/usuario/logar"
            );
        }


        const usuarioEncontrado =
            await Usuario.buscarPorId(
                usuario.id
            );


        if (!usuarioEncontrado) {

            return res.redirect(
                "/usuario/logar"
            );
        }


        return res.render(
            "pages/usuario/perfil",
            {

                usuario,

                usuarioPerfil:
                    usuarioEncontrado,

                titulo:
                    "Perfil",

                mensagem:
                    null

            }
        );
    }



    static async atualizarPerfil(
        req: Request,
        res: Response
    ) {

        try {

            const { usuario } = req.session as any;

            if (!usuario) {
                return res.redirect("/usuario/logar");
            }

            const usuarioEncontrado =
                await Usuario.buscarPorId(usuario.id);

            if (!usuarioEncontrado) {
                return res.redirect("/usuario/logar");
            }


            // ============================================
            // PEGA OS DADOS DO FORMULÁRIO
            // ============================================

            const nome =
                typeof req.body.nome === "string"
                    ? req.body.nome.trim()
                    : usuarioEncontrado.nome;

            const email =
                typeof req.body.email === "string"
                    ? req.body.email.trim()
                    : usuarioEncontrado.email;

            const senha =
                typeof req.body.senha === "string"
                    ? req.body.senha.trim()
                    : "";


            // ============================================
            // ATUALIZA NOME E EMAIL
            // ============================================

            if (nome !== "") {
                usuarioEncontrado.nome = nome;
            }

            if (email !== "") {
                usuarioEncontrado.email = email;
            }


            // ============================================
            // VERIFICA EMAIL DUPLICADO
            // ============================================

            const outroUsuario =
                await Usuario.buscarPorEmail(
                    usuarioEncontrado.email
                );

            if (
                outroUsuario &&
                outroUsuario.id !== usuarioEncontrado.id
            ) {

                return res.render(
                    "pages/usuario/perfil",
                    {
                        usuario,
                        usuarioPerfil: usuarioEncontrado,
                        titulo: "Perfil",

                        mensagem: {
                            tipo: "error",
                            valor: "Este e-mail já está sendo utilizado.",
                            titulo: "E-mail já cadastrado"
                        }
                    }
                );
            }


            // ============================================
            // SENHA
            // ============================================

            if (senha !== "") {
                usuarioEncontrado.senha = senha;
            }


            // ============================================
            // FOTO
            // ============================================

            if (req.file) {

                const pasta = path.join(
                    process.cwd(),
                    "public",
                    "uploads",
                    "perfis"
                );

                // Cria a pasta caso não exista
                if (!fs.existsSync(pasta)) {
                    fs.mkdirSync(pasta, {
                        recursive: true
                    });
                }

                const extensoes = [
                    ".jpg",
                    ".jpeg",
                    ".png",
                    ".webp"
                ];

                // Remove foto anterior
                for (const extensao of extensoes) {

                    const fotoAntiga = path.join(
                        pasta,
                        `${usuarioEncontrado.id}${extensao}`
                    );

                    if (fs.existsSync(fotoAntiga)) {
                        fs.unlinkSync(fotoAntiga);
                    }
                }

                // Descobre extensão
                let extensao = path.extname(
                    req.file.originalname
                ).toLowerCase();

                if (!extensoes.includes(extensao)) {

                    if (req.file.mimetype === "image/jpeg") {
                        extensao = ".jpg";
                    } else if (req.file.mimetype === "image/png") {
                        extensao = ".png";
                    } else if (req.file.mimetype === "image/webp") {
                        extensao = ".webp";
                    } else {
                        throw new Error(
                            "Formato de imagem não permitido."
                        );
                    }
                }

                // Nome da foto = ID do usuário
                const caminhoFinal = path.join(
                    pasta,
                    `${usuarioEncontrado.id}${extensao}`
                );

                // Salva fisicamente a foto
                if (req.file.buffer) {

                    fs.writeFileSync(
                        caminhoFinal,
                        req.file.buffer
                    );

                } else if (req.file.path) {

                    fs.renameSync(
                        req.file.path,
                        caminhoFinal
                    );

                } else {

                    throw new Error(
                        "Não foi possível salvar a foto."
                    );
                }
            }


            // ============================================
            // SALVA NO BANCO
            // ============================================

            await Usuario.atualizar(
                usuarioEncontrado
            );


            // ============================================
            // ATUALIZA A SESSÃO
            // ============================================

            (req.session as any).usuario = {

                id: usuarioEncontrado.id,

                nome: usuarioEncontrado.nome,

                email: usuarioEncontrado.email,

                tipo: usuarioEncontrado.tipo.nome
            };


            // ============================================
            // MOSTRA PERFIL ATUALIZADO
            // ============================================

            return res.render(
                "pages/usuario/perfil",
                {

                    usuario:
                        (req.session as any).usuario,

                    usuarioPerfil:
                        usuarioEncontrado,

                    titulo:
                        "Perfil",

                    mensagem: {

                        tipo: "success",

                        valor: req.file
                            ? "Perfil e foto atualizados com sucesso!"
                            : "Perfil atualizado com sucesso!",

                        titulo: "Sucesso"
                    }
                }
            );


        } catch (erro) {

            console.error(
                "ERRO AO ATUALIZAR PERFIL:",
                erro
            );


            const { usuario } =
                req.session as any;


            if (!usuario) {
                return res.redirect("/usuario/logar");
            }


            const usuarioEncontrado =
                await Usuario.buscarPorId(usuario.id);


            return res.render(
                "pages/usuario/perfil",
                {

                    usuario,

                    usuarioPerfil:
                        usuarioEncontrado,

                    titulo: "Perfil",

                    mensagem: {

                        tipo: "error",

                        valor:
                            "Não foi possível atualizar o perfil.",

                        titulo: "Erro"
                    }
                }
            );
        }
    }

    private static async salvarFoto(
        arquivo: Express.Multer.File,
        usuarioId: number
    ) {

        if (
            arquivo.size >
            5 * 1024 * 1024
        ) {

            throw new Error(
                "A foto não pode ter mais de 5 MB."
            );
        }


        const tiposPermitidos = [

            "image/jpeg",

            "image/jpg",

            "image/png",

            "image/webp"

        ];


        const mimetype =
            arquivo.mimetype
                ?.toLowerCase();


        if (
            mimetype &&
            !tiposPermitidos.includes(
                mimetype
            )
        ) {

            throw new Error(
                "Formato de imagem não permitido. Use JPG, JPEG, PNG ou WEBP."
            );
        }


        const pasta =
            path.join(
                process.cwd(),
                "public",
                "uploads",
                "perfis"
            );


        if (
            !fs.existsSync(
                pasta
            )
        ) {

            fs.mkdirSync(
                pasta,
                {
                    recursive: true
                }
            );
        }



        let extensao =
            path.extname(
                arquivo.originalname
            ).toLowerCase();


        if (
            extensao !== ".jpg" &&
            extensao !== ".jpeg" &&
            extensao !== ".png" &&
            extensao !== ".webp"
        ) {

            if (
                mimetype ===
                "image/jpeg"
            ) {

                extensao = ".jpg";

            } else if (
                mimetype ===
                "image/png"
            ) {

                extensao = ".png";

            } else if (
                mimetype ===
                "image/webp"
            ) {

                extensao = ".webp";

            } else {

                throw new Error(
                    "Extensão de imagem não permitida."
                );
            }
        }


        // -----------------------------------------------------
        // REMOVE FOTO ANTERIOR
        // -----------------------------------------------------

        const extensoes = [

            ".jpg",

            ".jpeg",

            ".png",

            ".webp"

        ];


        for (
            const ext of extensoes
        ) {

            const caminhoAntigo =
                path.join(
                    pasta,
                    `${usuarioId}${ext}`
                );


            if (
                fs.existsSync(
                    caminhoAntigo
                )
            ) {

                fs.unlinkSync(
                    caminhoAntigo
                );
            }
        }



        const caminhoFinal =
            path.join(
                pasta,
                `${usuarioId}${extensao}`
            );



        if (
            arquivo.buffer
        ) {

            fs.writeFileSync(
                caminhoFinal,
                arquivo.buffer
            );

            return;
        }



        if (
            arquivo.path &&
            fs.existsSync(
                arquivo.path
            )
        ) {

            fs.renameSync(
                arquivo.path,
                caminhoFinal
            );

            return;
        }


        throw new Error(
            "Não foi possível salvar a foto enviada."
        );
    }



    static async foto(
        req: Request,
        res: Response
    ) {

        try {

            const id =
                Number(req.params.id);


            if (
                !id ||
                Number.isNaN(id)
            ) {

                return res
                    .status(400)
                    .send(
                        "ID de usuário inválido"
                    );
            }


            const pasta =
                path.join(
                    process.cwd(),
                    "public",
                    "uploads",
                    "perfis"
                );


            const extensoes = [

                ".jpg",

                ".jpeg",

                ".png",

                ".webp"

            ];


            for (
                const extensao of extensoes
            ) {

                const caminho =
                    path.join(
                        pasta,
                        `${id}${extensao}`
                    );


                if (
                    fs.existsSync(
                        caminho
                    )
                ) {

                    return res.sendFile(
                        caminho
                    );
                }
            }


            return res
                .status(404)
                .send(
                    "Foto não encontrada"
                );


        } catch (erro) {

            console.error(
                "ERRO AO CARREGAR FOTO:",
                erro
            );


            return res
                .status(500)
                .send(
                    "Erro ao carregar foto"
                );
        }
    }

    static async excluirFoto(
    req: Request,
    res: Response
) {

    try {

        const { usuario } = req.session as any;

        if (!usuario) {
            return res.redirect("/usuario/logar");
        }


        const pasta = path.join(
            process.cwd(),
            "public",
            "uploads",
            "perfis"
        );


        const extensoes = [
            ".jpg",
            ".jpeg",
            ".png",
            ".webp"
        ];


        let fotoExcluida = false;


        for (const extensao of extensoes) {

            const caminho = path.join(
                pasta,
                `${usuario.id}${extensao}`
            );


            if (fs.existsSync(caminho)) {

                fs.unlinkSync(caminho);

                fotoExcluida = true;
            }
        }


        const usuarioEncontrado =
            await Usuario.buscarPorId(usuario.id);


        if (!usuarioEncontrado) {
            return res.redirect("/usuario/logar");
        }


        return res.render(
            "pages/usuario/perfil",
            {

                usuario,

                usuarioPerfil:
                    usuarioEncontrado,

                titulo: "Perfil",

                mensagem: {

                    tipo: "success",

                    valor: fotoExcluida
                        ? "Foto de perfil excluída com sucesso!"
                        : "Você não possui uma foto de perfil.",

                    titulo: "Foto de perfil"

                }

            }
        );

    } catch (erro) {

        console.error(
            "ERRO AO EXCLUIR FOTO:",
            erro
        );


        const { usuario } =
            req.session as any;


        if (!usuario) {
            return res.redirect("/usuario/logar");
        }


        const usuarioEncontrado =
            await Usuario.buscarPorId(usuario.id);


        return res.render(
            "pages/usuario/perfil",
            {

                usuario,

                usuarioPerfil:
                    usuarioEncontrado,

                titulo: "Perfil",

                mensagem: {

                    tipo: "error",

                    valor:
                        "Não foi possível excluir a foto.",

                    titulo: "Erro"

                }

            }
        );
    }
}

    static async excluir(
        req: Request,
        res: Response
    ) {

        const { id } =
            req.params;


        // Remove foto antes
        // de excluir o usuário.

        const pasta =
            path.join(
                process.cwd(),
                "public",
                "uploads",
                "perfis"
            );


        const extensoes = [

            ".jpg",

            ".jpeg",

            ".png",

            ".webp"

        ];


        for (
            const extensao of extensoes
        ) {

            const caminho =
                path.join(
                    pasta,
                    `${id}${extensao}`
                );


            if (
                fs.existsSync(
                    caminho
                )
            ) {

                fs.unlinkSync(
                    caminho
                );
            }
        }


        await Usuario.deletarPorId(
            id
        );


        return res.redirect(
            "../listar"
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


        const usuarioEncontrado =
            await Usuario.buscarPorId(
                id
            );


        if (!usuarioEncontrado) {

            throw new Error(
                "Usuário não encontrado"
            );
        }


        return res.render(
            "pages/usuario/editar",
            {

                titulo:
                    "Editar Usuário",

                mensagem:
                    null,

                usuarioParaEditar:
                    usuarioEncontrado,

                usuario

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
            "pages/usuario/cadastrar",
            {

                titulo:
                    "Cadastrar Usuário",

                mensagem:
                    null,

                usuario

            }
        );
    }


    static async cadastrarInterno(
        req: Request,
        res: Response
    ) {

        const {
            nome,
            email,
            senha,
            tipo
        } = req.body;


        const { usuario } =
            req.session as any;


        if (
            !nome ||
            !email ||
            !senha ||
            !tipo
        ) {

            return res.render(
                "pages/usuario/cadastrar",
                {

                    titulo:
                        "Cadastrar Usuário",

                    mensagem: {

                        tipo:
                            "error",

                        valor:
                            "Preencha todos os campos corretamente",

                        titulo:
                            "Erro"

                    },

                    usuario

                }
            );
        }


        const usuarioEncontrado =
            await Usuario.buscarPorEmail(
                email
            );


        if (usuarioEncontrado) {

            return res.render(
                "pages/usuario/cadastrar",
                {

                    titulo:
                        "Cadastrar Usuário",

                    mensagem: {

                        tipo:
                            "error",

                        valor:
                            "E-mail já existe",

                        titulo:
                            "Erro"

                    },

                    usuario

                }
            );
        }


        const tipoSelecionado =
            await TipoUsuario.buscarPorNome(
                tipo
            );


        if (!tipoSelecionado) {

            return res.render(
                "pages/usuario/cadastrar",
                {

                    titulo:
                        "Cadastrar Usuário",

                    mensagem: {

                        tipo:
                            "error",

                        valor:
                            "Tipo de usuário inválido",

                        titulo:
                            "Erro"

                    },

                    usuario

                }
            );
        }


        const novoUsuario =
            new Usuario({

                id:
                    0,

                nome,

                email,

                senha,

                tipo:
                    tipoSelecionado

            });


        await Usuario.cadastrar(
            novoUsuario
        );


        return res.render(
            "pages/usuario/cadastrar",
            {

                titulo:
                    "Cadastrar Usuário",

                mensagem: {

                    tipo:
                        "success",

                    valor:
                        "Usuário cadastrado com sucesso!",

                    titulo:
                        "Sucesso"

                },

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
            nome,
            email,
            tipo
        } = req.body;


        const { usuario } =
            req.session as any;


        const usuarioEncontrado =
            await Usuario.buscarPorId(
                id
            );


        if (!usuarioEncontrado) {

            throw new Error(
                "Usuário não encontrado"
            );
        }


        const tipoSelecionado =
            await TipoUsuario.buscarPorNome(
                tipo
            );


        if (!tipoSelecionado) {

            return res.render(
                "pages/usuario/editar",
                {

                    titulo:
                        "Editar Usuário",

                    mensagem: {

                        tipo:
                            "error",

                        valor:
                            "Tipo de usuário inválido",

                        titulo:
                            "Erro"

                    },

                    usuarioParaEditar:
                        usuarioEncontrado,

                    usuario

                }
            );
        }


        usuarioEncontrado.nome =
            nome;

        usuarioEncontrado.email =
            email;

        usuarioEncontrado.tipo =
            tipoSelecionado;


        await Usuario.atualizar(
            usuarioEncontrado
        );


        return res.render(
            "pages/usuario/editar",
            {

                titulo:
                    "Editar Usuário",

                mensagem: {

                    tipo:
                        "success",

                    valor:
                        "Dados salvos com sucesso!",

                    titulo:
                        "Sucesso"

                },

                usuarioParaEditar:
                    usuarioEncontrado,

                usuario

            }
        );
    }
}