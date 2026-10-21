import { connection } from "../Infra/Connection";
import { Ponto } from "./Ponto";
import { Rota } from "./Rota";

export class PontoRota {

    id: number;
    ponto: Ponto;
    rota: Rota;

    constructor({
        id,
        ponto,
        rota
    }: {
        id: number,
        ponto: Ponto,
        rota: Rota
    }) {

        this.id = id;
        this.ponto = ponto;
        this.rota = rota;
    }


    // CADASTRAR
    static async cadastrar(pontoRota: PontoRota) {

        await connection.query(
            `
            INSERT INTO ponto_rota
            (
                ponto_id,
                rota_id
            )
            VALUES ($1, $2)
            `,
            [
                pontoRota.ponto.id,
                pontoRota.rota.id
            ]
        );
    }


    // LISTAR TODOS
    static async buscarTodos() {

        const { rows } = await connection.query(`
            SELECT
                pr.id,

                p.id AS id_ponto,
                p.localizacao,
                p.descricao,
                p.latitude,
                p.longitude,

                r.id AS id_rota,
                r.descricao AS descricao_rota,
                r.tempo_medio

            FROM ponto_rota pr

            INNER JOIN ponto p
                ON pr.ponto_id = p.id

            INNER JOIN rota r
                ON pr.rota_id = r.id

            ORDER BY r.id, pr.id
        `);

        return rows.map((row: any) => {

            return new PontoRota({

                id: row.id,

                ponto: new Ponto({
                    id: row.id_ponto,
                    localizacao: row.localizacao,
                    descricao: row.descricao,
                    latitude: row.latitude,
                    longitude: row.longitude,
                    cidade: null as any
                }),

                rota: new Rota({
                    id: row.id_rota,
                    descricao: row.descricao_rota,
                    tempo_medio: row.tempo_medio
                })
            });
        });
    }


    // LISTAR PONTOS DE UMA ROTA
    static async buscarPorRota(rota_id: string) {

        const { rows } = await connection.query(
            `
            SELECT
                pr.id,

                p.id AS id_ponto,
                p.localizacao,
                p.descricao,
                p.latitude,
                p.longitude,

                r.id AS id_rota,
                r.descricao AS descricao_rota,
                r.tempo_medio

            FROM ponto_rota pr

            INNER JOIN ponto p
                ON pr.ponto_id = p.id

            INNER JOIN rota r
                ON pr.rota_id = r.id

            WHERE pr.rota_id = $1

            ORDER BY pr.id
            `,
            [rota_id]
        );

        return rows.map((row: any) => {

            return new PontoRota({

                id: row.id,

                ponto: new Ponto({
                    id: row.id_ponto,
                    localizacao: row.localizacao,
                    descricao: row.descricao,
                    latitude: row.latitude,
                    longitude: row.longitude,
                    cidade: null as any
                }),

                rota: new Rota({
                    id: row.id_rota,
                    descricao: row.descricao_rota,
                    tempo_medio: row.tempo_medio
                })
            });
        });
    }


    // BUSCAR POR ID DO VÍNCULO
    static async buscarPorId(id: string) {

        const { rows } = await connection.query(
            `
            SELECT
                pr.id,

                p.id AS id_ponto,
                p.localizacao,
                p.descricao,
                p.latitude,
                p.longitude,

                r.id AS id_rota,
                r.descricao AS descricao_rota,
                r.tempo_medio

            FROM ponto_rota pr

            INNER JOIN ponto p
                ON pr.ponto_id = p.id

            INNER JOIN rota r
                ON pr.rota_id = r.id

            WHERE pr.id = $1
            `,
            [id]
        );

        if (!rows[0]) {
            return null;
        }

        const row = rows[0];

        return new PontoRota({

            id: row.id,

            ponto: new Ponto({
                id: row.id_ponto,
                localizacao: row.localizacao,
                descricao: row.descricao,
                latitude: row.latitude,
                longitude: row.longitude,
                cidade: null as any
            }),

            rota: new Rota({
                id: row.id_rota,
                descricao: row.descricao_rota,
                tempo_medio: row.tempo_medio
            })
        });
    }


    // VERIFICAR SE JÁ EXISTE O VÍNCULO
    static async buscarVinculo(
        ponto_id: number,
        rota_id: number
    ) {

        const { rows } = await connection.query(
            `
            SELECT id
            FROM ponto_rota
            WHERE ponto_id = $1
            AND rota_id = $2
            `,
            [
                ponto_id,
                rota_id
            ]
        );

        return rows[0] || null;
    }


    // ATUALIZAR
    static async atualizar(pontoRota: PontoRota) {

        await connection.query(
            `
            UPDATE ponto_rota

            SET
                ponto_id = $1

            WHERE id = $2
            `,
            [
                pontoRota.ponto.id,
                pontoRota.id
            ]
        );
    }


    // DELETAR
    static async deletarPorId(id: string) {

        await connection.query(
            `
            DELETE FROM ponto_rota
            WHERE id = $1
            `,
            [id]
        );
    }
}