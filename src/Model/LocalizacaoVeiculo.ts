import { connection } from "../Infra/Connection";

import { Veiculo } from "./Veiculo";


export class LocalizacaoVeiculo {

    id: number;
    latitude: number;
    longitude: number;
    data_hora: Date;
    veiculo: Veiculo;


    constructor({
        id,
        latitude,
        longitude,
        data_hora,
        veiculo
    }: {
        id: number;
        latitude: number;
        longitude: number;
        data_hora: Date;
        veiculo: Veiculo;
    }) {

        this.id = id;
        this.latitude = latitude;
        this.longitude = longitude;
        this.data_hora = data_hora;
        this.veiculo = veiculo;

    }

    static async cadastrar(
        localizacaoVeiculo: LocalizacaoVeiculo
    ) {

        await connection.query(
            `
            INSERT INTO localizacao_veiculo
            (
                latitude,
                longitude,
                data_hora,
                veiculo_id
            )
            VALUES ($1, $2, $3, $4)
            `,
            [
                localizacaoVeiculo.latitude,
                localizacaoVeiculo.longitude,
                localizacaoVeiculo.data_hora,
                localizacaoVeiculo.veiculo.id
            ]
        );

    }



    static async buscarTodos() {

        const { rows } =
            await connection.query(
                `
                SELECT

                    lv.id,
                    lv.latitude,
                    lv.longitude,
                    lv.data_hora,

                    v.id AS id_veiculo,
                    v.status_veiculo,
                    v.capacidade_veiculo,
                    v.placa,
                    v.numero_veiculo

                FROM localizacao_veiculo lv

                INNER JOIN veiculo v
                    ON lv.veiculo_id = v.id

                ORDER BY lv.data_hora DESC
                `
            );


        return rows.map(
            (row: any) => {

                return new LocalizacaoVeiculo({

                    id: row.id,

                    latitude:
                        row.latitude,

                    longitude:
                        row.longitude,

                    data_hora:
                        row.data_hora,

                    veiculo:
                        new Veiculo({

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

                });

            }
        );

    }


    static async buscarPorId(id: string) {

        const { rows } =
            await connection.query(
                `
                SELECT

                    lv.id,
                    lv.latitude,
                    lv.longitude,
                    lv.data_hora,

                    v.id AS id_veiculo,
                    v.status_veiculo,
                    v.capacidade_veiculo,
                    v.placa,
                    v.numero_veiculo

                FROM localizacao_veiculo lv

                INNER JOIN veiculo v
                    ON lv.veiculo_id = v.id

                WHERE lv.id = $1
                `,
                [id]
            );


        if (!rows[0]) {

            return null;

        }


        const row =
            rows[0];


        return new LocalizacaoVeiculo({

            id:
                row.id,

            latitude:
                row.latitude,

            longitude:
                row.longitude,

            data_hora:
                row.data_hora,

            veiculo:
                new Veiculo({

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

        });

    }

    static async atualizar(
        localizacaoVeiculo: LocalizacaoVeiculo
    ) {

        await connection.query(
            `
            UPDATE localizacao_veiculo

            SET
                latitude = $1,
                longitude = $2,
                data_hora = $3,
                veiculo_id = $4

            WHERE id = $5
            `,
            [

                localizacaoVeiculo.latitude,

                localizacaoVeiculo.longitude,

                localizacaoVeiculo.data_hora,

                localizacaoVeiculo.veiculo.id,

                localizacaoVeiculo.id

            ]
        );

    }

    static async deletarPorId(id: string) {

        await connection.query(
            `
            DELETE FROM localizacao_veiculo
            WHERE id = $1
            `,
            [id]
        );

    }

}