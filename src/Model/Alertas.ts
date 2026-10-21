import { connection } from "../Infra/Connection";
import { LocalizacaoVeiculo } from "./LocalizacaoVeiculo";
import { Veiculo } from "./Veiculo";

export class Alerta {

    id: number;
    tipo: string;
    mensagem: string;
    data_criacao: Date;
    status: string;
    localizacao: LocalizacaoVeiculo | null;

    constructor({
        id,
        tipo,
        mensagem,
        data_criacao,
        status,
        localizacao
    }: {
        id: number;
        tipo: string;
        mensagem: string;
        data_criacao: Date;
        status: string;
        localizacao: LocalizacaoVeiculo | null;
    }) {

        this.id = id;
        this.tipo = tipo;
        this.mensagem = mensagem;
        this.data_criacao = data_criacao;
        this.status = status;
        this.localizacao = localizacao;

    }
    

    static async cadastrar(
        alerta: Alerta,
        localizacaoId: number | null
    ) {

        await connection.query(
            `
            INSERT INTO alertas
            (
                tipo,
                mensagem,
                data_criacao,
                status,
                localizacao_id
            )
            VALUES ($1, $2, $3, $4, $5)
            `,
            [
                alerta.tipo,
                alerta.mensagem,
                alerta.data_criacao,
                alerta.status,
                localizacaoId
            ]
        );

    }
    

    static async buscarTodos() {

        const { rows } = await connection.query(`
            
            SELECT
                a.id,
                a.tipo,
                a.mensagem,
                a.data_criacao,
                a.status,

                lv.id AS id_localizacao,
                lv.latitude,
                lv.longitude,
                lv.data_hora,

                v.id AS id_veiculo,
                v.status_veiculo,
                v.capacidade_veiculo,
                v.placa,
                v.numero_veiculo

            FROM alertas a

            LEFT JOIN localizacao_veiculo lv
                ON a.localizacao_id = lv.id

            LEFT JOIN veiculo v
                ON lv.veiculo_id = v.id

            ORDER BY a.data_criacao DESC
        `);

        return rows.map((row: any) => {

            let localizacao:
                LocalizacaoVeiculo | null = null;

                

            if (row.id_localizacao) {

                localizacao =
                    new LocalizacaoVeiculo({

                        id:
                            row.id_localizacao,

                        latitude:
                            row.latitude,

                        longitude:
                            row.longitude,

                        data_hora:
                            row.data_hora,

                        veiculo:
                            row.id_veiculo
                                ? new Veiculo({

                                    id:
                                        row.id_veiculo,

                                    status_veiculo:
                                        row.status_veiculo,

                                    capacidade_veiculo:
                                        row.capacidade_veiculo,

                                    placa:
                                        row.placa,

                                    numero_veiculo:
                                        row.numero_veiculo

                                })
                                : null as any

                    });

            }
            

            return new Alerta({

                id:
                    row.id,

                tipo:
                    row.tipo,

                mensagem:
                    row.mensagem,

                data_criacao:
                    row.data_criacao,

                status:
                    row.status,

                localizacao

            });

        });

    }
    

    static async atualizar(
        alerta: Alerta
    ) {

        await connection.query(
            `
            UPDATE alertas
            SET
                tipo = $1,
                mensagem = $2,
                status = $3,
                localizacao_id = $4
            WHERE id = $5
            `,
            [

                alerta.tipo,

                alerta.mensagem,

                alerta.status,

                alerta.localizacao
                    ? alerta.localizacao.id
                    : null,

                alerta.id

            ]
        );

    }


    static async deletarPorId(
        id: string
    ) {

        await connection.query(
            `
            DELETE FROM alertas
            WHERE id = $1
            `,
            [id]
        );

    }

    static async buscarPorId(
        id: string
    ) {

        const { rows } =
            await connection.query(
                `
                SELECT

                    a.id,
                    a.tipo,
                    a.mensagem,
                    a.data_criacao,
                    a.status,

                    lv.id AS id_localizacao,
                    lv.latitude,
                    lv.longitude,
                    lv.data_hora,

                    v.id AS id_veiculo,
                    v.status_veiculo,
                    v.capacidade_veiculo,
                    v.placa,
                    v.numero_veiculo

                FROM alertas a

                LEFT JOIN localizacao_veiculo lv
                    ON a.localizacao_id = lv.id

                LEFT JOIN veiculo v
                    ON lv.veiculo_id = v.id

                WHERE a.id = $1
                `,
                [id]
            );


        if (!rows[0]) {

            return null;

        }


        const row = rows[0];


        let localizacao:
            LocalizacaoVeiculo | null = null;


        if (row.id_localizacao) {

            localizacao =
                new LocalizacaoVeiculo({

                    id: row.id_localizacao,

                    latitude: row.latitude,

                    longitude: row.longitude,

                    data_hora: row.data_hora,

                    veiculo: row.id_veiculo ? new Veiculo({

                        id: row.id_veiculo,
                        status_veiculo: row.status_veiculo,
                        capacidade_veiculo: row.capacidade_veiculo,
                        placa: row.placa,
                        numero_veiculo: row.numero_veiculo

                    })
                        : null as any

                });

        }


        return new Alerta({

            id: row.id,
            tipo: row.tipo,
            mensagem: row.mensagem,
            data_criacao: row.data_criacao,
            status: row.status, localizacao

        });

    }

}