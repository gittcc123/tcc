import { Request, Response } from "express";
import { Rota } from "../Model/Rota";

export class RotaController {

    // ==========================================
    // LISTAR
    // ==========================================

    static async carregarListar(
        req: Request,
        res: Response
    ) {

        const { usuario } = req.session as any;

        const rotas = await Rota.buscarTodos();

        return res.render(
            'pages/rota/listar',
            {
                titulo: 'Listar Rotas',
                rotas,
                usuario,
                mensagem: null
            }
        );
    }

    // ==========================================
    // ABRIR CADASTRO
    // ==========================================

    static async carregarCadastrar(
        req: Request,
        res: Response
    ) {

        const { usuario } = req.session as any;

        return res.render(
            'pages/rota/cadastrar',
            {
                titulo: 'Cadastrar Rota',
                usuario,
                mensagem: null
            }
        );
    }

    // ==========================================
    // CADASTRAR
    // ==========================================

    static async cadastrar(
        req: Request,
        res: Response
    ) {

        const {
            descricao,
            tempo_medio
        } = req.body;

        const { usuario } = req.session as any;

        const descricaoTratada =
            String(descricao || '').trim();

        const tempoNumero =
            Number(tempo_medio);

        if (
            !descricaoTratada ||
            Number.isNaN(tempoNumero) ||
            tempoNumero <= 0
        ) {

            return res.render(
                'pages/rota/cadastrar',
                {
                    titulo: 'Cadastrar Rota',
                    usuario,
                    mensagem: {
                        tipo: 'error',
                        tituloMensagem: 'Dados inválidos',
                        valor: 'Informe a descrição e um tempo médio válido.'
                    }
                }
            );
        }

        const rotaExistente =
            await Rota.buscarPorDescricao(
                descricaoTratada
            );

        if (rotaExistente) {

            return res.render(
                'pages/rota/cadastrar',
                {
                    titulo: 'Cadastrar Rota',
                    usuario,
                    mensagem: {
                        tipo: 'error',
                        tituloMensagem: 'Rota já cadastrada',
                        valor: 'Já existe uma rota com essa descrição.'
                    }
                }
            );
        }

        const novaRota = new Rota({

            descricao: descricaoTratada,

            tempo_medio: tempoNumero

        });

        await Rota.cadastrar(novaRota);

        return res.render(
            'pages/rota/cadastrar',
            {
                titulo: 'Cadastrar Rota',
                usuario,
                mensagem: {
                    tipo: 'success',
                    tituloMensagem: 'Sucesso',
                    valor: 'Rota cadastrada com sucesso!'
                }
            }
        );
    }

    // ==========================================
    // ABRIR EDIÇÃO
    // ==========================================

    static async carregarEditar(
        req: Request,
        res: Response
    ) {

        const { id } = req.params;

        const { usuario } = req.session as any;

        const rota =
            await Rota.buscarPorId(id);

        if (!rota) {

            throw new Error(
                'Rota não encontrada.'
            );
        }

        return res.render(
            'pages/rota/editar',
            {
                titulo: 'Editar Rota',
                usuario,
                rotaParaEditar: rota,
                mensagem: null
            }
        );
    }

    // ==========================================
    // EDITAR
    // ==========================================

    static async editar(
        req: Request,
        res: Response
    ) {

        const { id } = req.params;

        const {
            descricao,
            tempo_medio
        } = req.body;

        const { usuario } = req.session as any;

        const rota =
            await Rota.buscarPorId(id);

        if (!rota) {

            throw new Error(
                'Rota não encontrada.'
            );
        }

        const descricaoTratada =
            String(descricao || '').trim();

        const tempoNumero =
            Number(tempo_medio);

        if (
            !descricaoTratada ||
            Number.isNaN(tempoNumero) ||
            tempoNumero <= 0
        ) {

            return res.render(
                'pages/rota/editar',
                {
                    titulo: 'Editar Rota',
                    usuario,
                    rotaParaEditar: rota,
                    mensagem: {
                        tipo: 'error',
                        tituloMensagem: 'Dados inválidos',
                        valor: 'Informe a descrição e um tempo médio válido.'
                    }
                }
            );
        }

        const rotaExistente =
            await Rota.buscarPorDescricao(
                descricaoTratada,
                Number(id)
            );

        if (rotaExistente) {

            rota.descricao =
                descricaoTratada;

            rota.tempo_medio =
                tempoNumero;

            return res.render(
                'pages/rota/editar',
                {
                    titulo: 'Editar Rota',
                    usuario,
                    rotaParaEditar: rota,
                    mensagem: {
                        tipo: 'error',
                        tituloMensagem: 'Descrição já utilizada',
                        valor: 'Já existe outra rota com essa descrição.'
                    }
                }
            );
        }

        rota.descricao =
            descricaoTratada;

        rota.tempo_medio =
            tempoNumero;

        await Rota.atualizar(rota);

        return res.render(
            'pages/rota/editar',
            {
                titulo: 'Editar Rota',
                usuario,
                rotaParaEditar: rota,
                mensagem: {
                    tipo: 'success',
                    tituloMensagem: 'Sucesso',
                    valor: 'Rota atualizada com sucesso!'
                }
            }
        );
    }

    // ==========================================
    // EXCLUIR
    // ==========================================

    static async excluir(
        req: Request,
        res: Response
    ) {

        const { id } = req.params;

        try {

            await Rota.deletarPorId(id);

            return res.redirect(
                '/rota/listar'
            );

        } catch (error: any) {

            console.error(
                'Erro no controller ao excluir rota:',
                error
            );

            /*
             * Se ainda existir alguma FK além de
             * ponto_rota, mostra uma mensagem amigável.
             */
            const { usuario } =
                req.session as any;

            const rotas =
                await Rota.buscarTodos();

            return res.status(409).render(
                'pages/rota/listar',
                {
                    titulo: 'Listar Rotas',
                    rotas,
                    usuario,
                    mensagem: {
                        tipo: 'error',
                        tituloMensagem: 'Não foi possível excluir',
                        valor:
                            'Esta rota possui vínculos com outros registros do sistema. Remova esses vínculos antes de excluir a rota.'
                    }
                }
            );
        }
    }
}