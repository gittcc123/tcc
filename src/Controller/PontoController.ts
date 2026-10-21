import { Request, Response } from "express";
import { Ponto } from "../Model/Ponto";

export class PontoController {

    // ==========================================
    // LISTAR
    // ==========================================

    static async carregarListar(
        req: Request,
        res: Response
    ) {

        const { usuario } = req.session as any;

        const pontos = await Ponto.buscarTodos();

        return res.render(
            'pages/ponto/listar',
            {
                titulo: 'Pontos Monitorados',
                pontos,
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
            'pages/ponto/cadastrar',
            {
                titulo: 'Cadastrar Ponto',
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
            localizacao,
            descricao,
            latitude,
            longitude,
            cidade
        } = req.body;

        const { usuario } = req.session as any;

        const latitudeNumero = Number(latitude);
        const longitudeNumero = Number(longitude);
        const cidadeNumero = Number(cidade);

        if (
            !localizacao ||
            !descricao ||
            latitude === undefined ||
            latitude === '' ||
            longitude === undefined ||
            longitude === '' ||
            !cidade
        ) {

            return res.render(
                'pages/ponto/cadastrar',
                {
                    titulo: 'Cadastrar Ponto',
                    usuario,
                    mensagem: {
                        tipo: 'error',
                        tituloMensagem: 'Dados inválidos',
                        valor: 'Preencha todos os campos corretamente.'
                    }
                }
            );
        }

        if (
            Number.isNaN(latitudeNumero) ||
            Number.isNaN(longitudeNumero) ||
            Number.isNaN(cidadeNumero)
        ) {

            return res.render(
                'pages/ponto/cadastrar',
                {
                    titulo: 'Cadastrar Ponto',
                    usuario,
                    mensagem: {
                        tipo: 'error',
                        tituloMensagem: 'Dados inválidos',
                        valor: 'Latitude, longitude e cidade devem possuir valores válidos.'
                    }
                }
            );
        }

        const novoPonto = new Ponto({

            localizacao: String(localizacao).trim(),

            descricao: String(descricao).trim(),

            latitude: latitudeNumero,

            longitude: longitudeNumero,

            cidade: cidadeNumero

        });

        await Ponto.cadastrar(novoPonto);

        return res.render(
            'pages/ponto/cadastrar',
            {
                titulo: 'Cadastrar Ponto',
                usuario,
                mensagem: {
                    tipo: 'success',
                    tituloMensagem: 'Sucesso',
                    valor: 'Ponto cadastrado com sucesso!'
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

        const ponto = await Ponto.buscarPorId(id);

        if (!ponto) {
            throw new Error('Ponto não encontrado');
        }

        return res.render(
            'pages/ponto/editar',
            {
                titulo: 'Editar Ponto',
                usuario,
                ponto,
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
            localizacao,
            descricao,
            latitude,
            longitude,
            cidade
        } = req.body;

        const { usuario } = req.session as any;

        const ponto = await Ponto.buscarPorId(id);

        if (!ponto) {
            throw new Error('Ponto não encontrado');
        }

        const latitudeNumero = Number(latitude);
        const longitudeNumero = Number(longitude);
        const cidadeNumero = Number(cidade);

        if (
            !localizacao ||
            !descricao ||
            Number.isNaN(latitudeNumero) ||
            Number.isNaN(longitudeNumero) ||
            Number.isNaN(cidadeNumero)
        ) {

            return res.render(
                'pages/ponto/editar',
                {
                    titulo: 'Editar Ponto',
                    usuario,
                    ponto,
                    mensagem: {
                        tipo: 'error',
                        tituloMensagem: 'Dados inválidos',
                        valor: 'Preencha todos os campos corretamente.'
                    }
                }
            );
        }

        ponto.localizacao = String(localizacao).trim();

        ponto.descricao = String(descricao).trim();

        ponto.latitude = latitudeNumero;

        ponto.longitude = longitudeNumero;

        ponto.cidade = cidadeNumero;

        await Ponto.atualizar(ponto);

        return res.render(
            'pages/ponto/editar',
            {
                titulo: 'Editar Ponto',
                usuario,
                ponto,
                mensagem: {
                    tipo: 'success',
                    tituloMensagem: 'Sucesso',
                    valor: 'Ponto atualizado com sucesso!'
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

        await Ponto.deletarPorId(id);

        return res.redirect('/ponto/listar');
    }
}