import { connection } from "../Infra/Connection";

export class Escala {

    id?: number;
    descricao: string;
    turno: string;

    constructor({
        id,
        descricao,
        turno
    }: {
        id?: number,
        descricao: string,
        turno: string
    }) {

        this.id = id;
        this.descricao = descricao;
        this.turno = turno;

    }

    static async cadastrar(escala: Escala) {

        await connection.query(
            `
            INSERT INTO escala
            (descricao, turno)
            VALUES ($1, $2)
            `,
            [
                escala.descricao,
                escala.turno
            ]
        );

    }

    static async buscarTodos() {

        const { rows } = await connection.query(
            'SELECT * FROM escala ORDER BY id'
        );

        return rows.map((row: any) => new Escala({
            id: row.id,
            descricao: row.descricao,
            turno: row.turno
        }));

    }

    static async atualizar(escala: Escala) {

        await connection.query(
            `
            UPDATE escala
            SET
                descricao = $1,
                turno = $2
            WHERE id = $3
            `,
            [
                escala.descricao,
                escala.turno,
                escala.id
            ]
        );

    }

    static async deletarPorId(id: string) {

        await connection.query(
            'DELETE FROM escala WHERE id = $1',
            [id]
        );

    }

    static async buscarPorId(id: string) {

        const { rows } = await connection.query(
            'SELECT * FROM escala WHERE id = $1',
            [id]
        );

        if (!rows[0]) {
            return null;
        }

        return new Escala({
            id: rows[0].id,
            descricao: rows[0].descricao,
            turno: rows[0].turno
        });

    }

    static async buscarPorDescricao(descricao: string) {

        const { rows } = await connection.query(
            'SELECT * FROM escala WHERE descricao = $1',
            [descricao]
        );

        if (!rows[0]) {
            return null;
        }

        return new Escala({
            id: rows[0].id,
            descricao: rows[0].descricao,
            turno: rows[0].turno
        });

    }

}