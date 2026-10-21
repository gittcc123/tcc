
import { Request, Response } from "express";

import { PontoRota } from "../Model/PontoRota";
import { Ponto } from "../Model/Ponto";
import { Rota } from "../Model/Rota";


export class PontoRotaController {


    // =========================
    // LISTAR
    // =========================

    static async carregarListar(
        req: Request,
        res: Response
    ) {

        const { usuario } =
            req.session as any;

        const pontosRotas =
            await PontoRota.buscarTodos();

        return res.render(
            "pages/pontoRota/listar",
            {
                titulo: "Pontos x Rotas",
                pontosRotas,
                usuario,
                mensagem: null
            }
        );
    }



    static async carregarCadastrar(
        req: Request,
        res: Response
    ) {

        const { usuario } =
            req.session as any;

        const pontos =
            await Ponto.buscarTodos();

        const rotas =
            await Rota.buscarTodos();

        return res.render(
            "pages/pontoRota/cadastrar",
            {
                titulo: "Cadastrar Ponto x Rota",
                pontos,
                rotas,
                usuario,
                mensagem: null
            }
        );
    }


    static async cadastrar(
        req: Request,
        res: Response
    ) {

        const {
            ponto_id,
            rota_id
        } = req.body;

        const { usuario } =
            req.session as any;


        const pontos =
            await Ponto.buscarTodos();

        const rotas =
            await Rota.buscarTodos();



        if (!ponto_id || !rota_id) {

            return res.render(
                "pages/pontoRota/cadastrar",
                {
                    titulo: "Cadastrar Ponto x Rota",
                    pontos,
                    rotas,
                    usuario,
                    mensagem: {
                        tipo: "error",
                        titulo: "Erro",
                        valor: "Selecione uma rota e um ponto."
                    }
                }
            );
        }



        const existente =
            await PontoRota.buscarVinculo(
                Number(ponto_id),
                Number(rota_id)
            );


        if (existente) {

            return res.render(
                "pages/pontoRota/cadastrar",
                {
                    titulo: "Cadastrar Ponto x Rota",
                    pontos,
                    rotas,
                    usuario,
                    mensagem: {
                        tipo: "error",
                        titulo: "Atenção",
                        valor: "Este ponto já está associado a esta rota."
                    }
                }
            );
        }


     

        const novoPontoRota =
            new PontoRota({

                id: 0,

                ponto: new Ponto({
                    id: Number(ponto_id),
                    localizacao: "",
                    descricao: "",
                    latitude: 0,
                    longitude: 0,
                    cidade: 0
                }),

                rota: new Rota({
                    id: Number(rota_id),
                    descricao: "",
                    tempo_medio: 0
                })

            });


        await PontoRota.cadastrar(
            novoPontoRota
        );


        return res.redirect(
            "/pontoRota/listar"
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


        const pontoRota =
            await PontoRota.buscarPorId(id);


        if (!pontoRota) {

            throw new Error(
                "Registro não encontrado"
            );
        }


        const pontos =
            await Ponto.buscarTodos();

        const rotas =
            await Rota.buscarTodos();


        return res.render(
            "pages/pontoRota/editar",
            {
                titulo: "Editar Ponto x Rota",
                pontoRota,
                pontos,
                rotas,
                usuario,
                mensagem: null
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
            ponto_id,
            rota_id
        } = req.body;

        const { usuario } =
            req.session as any;


        const pontoRota =
            await PontoRota.buscarPorId(id);


        if (!pontoRota) {

            throw new Error(
                "Registro não encontrado"
            );
        }


        const pontos =
            await Ponto.buscarTodos();

        const rotas =
            await Rota.buscarTodos();


        if (!ponto_id || !rota_id) {

            return res.render(
                "pages/pontoRota/editar",
                {
                    titulo: "Editar Ponto x Rota",
                    pontoRota,
                    pontos,
                    rotas,
                    usuario,
                    mensagem: {
                        tipo: "error",
                        titulo: "Erro",
                        valor: "Selecione uma rota e um ponto."
                    }
                }
            );
        }


        pontoRota.ponto.id =
            Number(ponto_id);

        pontoRota.rota.id =
            Number(rota_id);


        await PontoRota.atualizar(
            pontoRota
        );


        return res.redirect(
            "/pontoRota/listar"
        );
    }


    static async excluir(
        req: Request,
        res: Response
    ) {

        const { id } =
            req.params;


        await PontoRota.deletarPorId(
            id
        );


        return res.redirect(
            "/pontoRota/listar"
        );
    }

}

