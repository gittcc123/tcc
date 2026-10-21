import { connection } from "../Infra/Connection";

export class Cidade {

    id?: number;
    nome: string;
    cep: string;
    estado_id: number;

    constructor({
        id,
        nome,
        cep,
        estado_id
    }: {
        id?: number;
        nome: string;
        cep: string;
        estado_id: number;
    }) {

        this.id = id;
        this.nome = nome;
        this.cep = cep;
        this.estado_id = estado_id;

    }


    static async cadastrar(cidade: Cidade) {

        await connection.query(
            `
            INSERT INTO cidade
            (nome, cep, estado_id)
            VALUES ($1, $2, $3)
            `,
            [
                cidade.nome,
                cidade.cep,
                cidade.estado_id
            ]
        );

    }


    static async buscarTodos() {

        const { rows } = await connection.query(
            `
            SELECT
                id,
                nome,
                cep,
                estado_id
            FROM cidade
            ORDER BY id
            `
        );

        return rows.map((row: any) => new Cidade({
            id: row.id,
            nome: row.nome,
            cep: row.cep,
            estado_id: row.estado_id
        }));

    }


    static async atualizar(cidade: Cidade) {

        await connection.query(
            `
            UPDATE cidade
            SET
                nome = $1,
                cep = $2,
                estado_id = $3
            WHERE id = $4
            `,
            [
                cidade.nome,
                cidade.cep,
                cidade.estado_id,
                cidade.id
            ]
        );

    }


    static async deletarPorId(id: string) {

        await connection.query(
            `
            DELETE FROM cidade
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
                cep,
                estado_id
            FROM cidade
            WHERE id = $1
            `,
            [id]
        );

        if (!rows[0]) {
            return null;
        }

        return new Cidade({
            id: rows[0].id,
            nome: rows[0].nome,
            cep: rows[0].cep,
            estado_id: rows[0].estado_id
        });

    }


    static async buscarPorNome(nome: string) {

        const { rows } = await connection.query(
            `
            SELECT
                id,
                nome,
                cep,
                estado_id
            FROM cidade
            WHERE nome = $1
            `,
            [nome]
        );

        if (!rows[0]) {
            return null;
        }

        return new Cidade({
            id: rows[0].id,
            nome: rows[0].nome,
            cep: rows[0].cep,
            estado_id: rows[0].estado_id
        });

    }

}

