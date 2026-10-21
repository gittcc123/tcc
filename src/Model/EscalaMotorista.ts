import { connection } from "../Infra/Connection";
import { Motorista } from "./Motorista";
import { Veiculo } from "./Veiculo";
import { Escala } from "./Escala";

export class EscalaMotorista {

    id: number;
    horario_inicio: Date;
    horario_fim: Date;
    motorista: Motorista;
    veiculo: Veiculo;
    escala: Escala;

    constructor({
        id,
        horario_inicio,
        horario_fim,
        motorista,
        veiculo,
        escala
    }: {
        id: number,
        horario_inicio: Date,
        horario_fim: Date,
        motorista: Motorista,
        veiculo: Veiculo,
        escala: Escala
    }) {

        this.id = id;
        this.horario_inicio = horario_inicio;
        this.horario_fim = horario_fim;
        this.motorista = motorista;
        this.veiculo = veiculo;
        this.escala = escala;

    }


    // ============================================================
    // CADASTRAR
    // ============================================================

    static async cadastrar(escalaMotorista: EscalaMotorista) {

        /*
         * Verifica se o mesmo motorista já está usando
         * o mesmo veículo no mesmo dia.
         *
         * Em outro dia, pode cadastrar normalmente.
         */

        const conflito = await connection.query(
            `
            SELECT id
            FROM escala_motorista
            WHERE motorista_id = $1
              AND veiculo_id = $2
              AND horario_inicio::date = $3::date
            LIMIT 1
            `,
            [
                escalaMotorista.motorista.id,
                escalaMotorista.veiculo.id,
                escalaMotorista.horario_inicio
            ]
        );

        if (conflito.rows.length > 0) {

            throw new Error(
                "Este motorista já está utilizando este veículo neste dia."
            );

        }


        await connection.query(
            `
            INSERT INTO escala_motorista
            (
                horario_inicio,
                horario_fim,
                motorista_id,
                veiculo_id,
                escala_id
            )
            VALUES ($1, $2, $3, $4, $5)
            `,
            [
                escalaMotorista.horario_inicio,
                escalaMotorista.horario_fim,
                escalaMotorista.motorista.id,
                escalaMotorista.veiculo.id,
                escalaMotorista.escala.id
            ]
        );

    }


    // ============================================================
    // BUSCAR TODOS
    // ============================================================

    static async buscarTodos() {

        const { rows } = await connection.query(`
        
            SELECT

                em.id,
                em.horario_inicio,
                em.horario_fim,

                m.id AS id_motorista,
                m.telefone,
                m.ativo,

                u.id AS id_usuario,
                u.nome AS nome_motorista,
                u.email AS email_motorista,

                v.id AS id_veiculo,
                v.status_veiculo,
                v.capacidade_veiculo,
                v.placa,
                v.numero_veiculo,

                e.id AS id_escala,
                e.descricao,
                e.turno

            FROM escala_motorista em

            INNER JOIN motorista m
                ON em.motorista_id = m.id

            INNER JOIN usuario u
                ON m.usuario_id = u.id

            INNER JOIN veiculo v
                ON em.veiculo_id = v.id

            INNER JOIN escala e
                ON em.escala_id = e.id

            ORDER BY em.horario_inicio ASC

        `);


        return rows.map((row: any) => new EscalaMotorista({

            id: row.id,

            horario_inicio: row.horario_inicio,

            horario_fim: row.horario_fim,

            motorista: new Motorista({

                id: row.id_motorista,

                telefone: row.telefone,

                ativo: row.ativo,

                usuario: {
                    id: row.id_usuario,
                    nome: row.nome_motorista,
                    email: row.email_motorista
                } as any

            }),

            veiculo: new Veiculo({

                id: row.id_veiculo,

                status_veiculo: row.status_veiculo,

                capacidade_veiculo: row.capacidade_veiculo,

                placa: row.placa,

                numero_veiculo: row.numero_veiculo

            }),

            escala: new Escala({

                id: row.id_escala,

                descricao: row.descricao,

                turno: row.turno

            })

        }));

    }


    // ============================================================
    // ATUALIZAR
    // ============================================================

    static async atualizar(escalaMotorista: EscalaMotorista) {

        /*
         * Verifica se existe outra escala usando:
         *
         * mesmo motorista
         * +
         * mesmo veículo
         * +
         * mesmo dia
         *
         * O próprio registro que está sendo editado é ignorado.
         */

        const conflito = await connection.query(
            `
            SELECT id
            FROM escala_motorista
            WHERE motorista_id = $1
              AND veiculo_id = $2
              AND horario_inicio::date = $3::date
              AND id <> $4
            LIMIT 1
            `,
            [
                escalaMotorista.motorista.id,
                escalaMotorista.veiculo.id,
                escalaMotorista.horario_inicio,
                escalaMotorista.id
            ]
        );


        if (conflito.rows.length > 0) {

            throw new Error(
                "Este motorista já está utilizando este veículo neste dia."
            );

        }


        await connection.query(
            `
            UPDATE escala_motorista
            SET
                horario_inicio = $1,
                horario_fim = $2,
                motorista_id = $3,
                veiculo_id = $4,
                escala_id = $5
            WHERE id = $6
            `,
            [
                escalaMotorista.horario_inicio,
                escalaMotorista.horario_fim,
                escalaMotorista.motorista.id,
                escalaMotorista.veiculo.id,
                escalaMotorista.escala.id,
                escalaMotorista.id
            ]
        );

    }


    // ============================================================
    // DELETAR
    // ============================================================

    static async deletarPorId(id: string) {

        await connection.query(
            `
            DELETE FROM escala_motorista
            WHERE id = $1
            `,
            [id]
        );

    }


    // ============================================================
    // BUSCAR POR ID
    // ============================================================

    static async buscarPorId(id: string) {

        const { rows } = await connection.query(
            `
            SELECT

                em.id,
                em.horario_inicio,
                em.horario_fim,

                m.id AS id_motorista,
                m.telefone,
                m.ativo,

                v.id AS id_veiculo,
                v.status_veiculo,
                v.capacidade_veiculo,
                v.placa,
                v.numero_veiculo,

                e.id AS id_escala,
                e.descricao,
                e.turno

            FROM escala_motorista em

            INNER JOIN motorista m
                ON em.motorista_id = m.id

            INNER JOIN veiculo v
                ON em.veiculo_id = v.id

            INNER JOIN escala e
                ON em.escala_id = e.id

            WHERE em.id = $1

            `,
            [id]
        );


        if (!rows[0]) {
            return null;
        }


        return new EscalaMotorista({

            id: rows[0].id,

            horario_inicio: rows[0].horario_inicio,

            horario_fim: rows[0].horario_fim,

            motorista: new Motorista({

                id: rows[0].id_motorista,

                telefone: rows[0].telefone,

                ativo: rows[0].ativo,

                usuario: null as any

            }),

            veiculo: new Veiculo({

                id: rows[0].id_veiculo,

                status_veiculo: rows[0].status_veiculo,

                capacidade_veiculo: rows[0].capacidade_veiculo,

                placa: rows[0].placa,

                numero_veiculo: rows[0].numero_veiculo

            }),

            escala: new Escala({

                id: rows[0].id_escala,

                descricao: rows[0].descricao,

                turno: rows[0].turno

            })

        });

    }

}