import { connection } from "../Infra/Connection";

export class Estado {

    id?: number;
    nome: string;
    sigla_estado: string;

    constructor({
        id,
        nome,
        sigla_estado
    }: {
        id?: number;
        nome: string;
        sigla_estado: string;
    }) {

        this.id = id;
        this.nome = nome;
        this.sigla_estado = sigla_estado;

    }


    static async cadastrar(estado: Estado) {

        await connection.query(
            `
            INSERT INTO estado
            (nome, sigla_estado)
            VALUES ($1, $2)
            `,
            [
                estado.nome,
                estado.sigla_estado
            ]
        );

    }


    static async buscarTodos() {

        const { rows } = await connection.query(
            `
            SELECT
                id,
                nome,
                sigla_estado
            FROM estado
            ORDER BY id
            `
        );

        return rows.map((row: any) => new Estado({

            id: row.id,
            nome: row.nome,
            sigla_estado: row.sigla_estado

        }));

    }


    static async atualizar(estado: Estado) {

        await connection.query(
            `
            UPDATE estado
            SET
                nome = $1,
                sigla_estado = $2
            WHERE id = $3
            `,
            [
                estado.nome,
                estado.sigla_estado,
                estado.id
            ]
        );

    }


    static async deletarPorId(id: string) {

        await connection.query(
            `
            DELETE FROM estado
            WHERE id = $1
            `,
            [id]
        );

    }


    static async buscarPorId(id: string) {

        const { rows } = await connection.query(
            `
            SELECT
                id,
                nome,
                sigla_estado
            FROM estado
            WHERE id = $1
            `,
            [id]
        );

        if (!rows[0]) {
            return null;
        }

        return new Estado({

            id: rows[0].id,
            nome: rows[0].nome,
            sigla_estado: rows[0].sigla_estado

        });

    }


    static async buscarPorSigla(sigla_estado: string) {

        const { rows } = await connection.query(
            `
            SELECT
                id,
                nome,
                sigla_estado
            FROM estado
            WHERE sigla_estado = $1
            `,
            [sigla_estado]
        );

        if (!rows[0]) {
            return null;
        }

        return new Estado({

            id: rows[0].id,
            nome: rows[0].nome,
            sigla_estado: rows[0].sigla_estado

        });

    }

}
