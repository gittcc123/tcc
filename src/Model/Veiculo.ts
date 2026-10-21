import { connection } from "../Infra/Connection";

export class Veiculo {

    id?: number;
    status_veiculo: boolean;
    capacidade_veiculo: number;
    placa: string;
    numero_veiculo: string;

    constructor({
        id,
        status_veiculo,
        capacidade_veiculo,
        placa,
        numero_veiculo
    }: {
        id?: number,
        status_veiculo: boolean,
        capacidade_veiculo: number,
        placa: string,
        numero_veiculo: string
    }) {

        this.id = id;
        this.status_veiculo = status_veiculo;
        this.capacidade_veiculo = capacidade_veiculo;
        this.placa = placa;
        this.numero_veiculo = numero_veiculo;

    }

    static async cadastrar(veiculo: Veiculo) {

        await connection.query(
            `
            INSERT INTO veiculo
            (status_veiculo, capacidade_veiculo, placa, numero_veiculo)
            VALUES ($1, $2, $3, $4)
            `,
            [
                veiculo.status_veiculo,
                veiculo.capacidade_veiculo,
                veiculo.placa,
                veiculo.numero_veiculo
            ]
        );

    }

    static async buscarTodos() {

        const { rows } = await connection.query(
            'SELECT * FROM veiculo ORDER BY id'
        );

        return rows.map((row: any) => new Veiculo({
            id: row.id,
            status_veiculo: row.status_veiculo,
            capacidade_veiculo: row.capacidade_veiculo,
            placa: row.placa,
            numero_veiculo: row.numero_veiculo
        }));

    }

    static async atualizar(veiculo: Veiculo) {

        await connection.query(
            `
            UPDATE veiculo
            SET
                status_veiculo = $1,
                capacidade_veiculo = $2,
                placa = $3,
                numero_veiculo = $4
            WHERE id = $5
            `,
            [
                veiculo.status_veiculo,
                veiculo.capacidade_veiculo,
                veiculo.placa,
                veiculo.numero_veiculo,
                veiculo.id
            ]
        );

    }

    static async deletarPorId(id: string) {

        await connection.query(
            'DELETE FROM veiculo WHERE id = $1',
            [id]
        );

    }

    static async buscarPorId(id: string) {

        const { rows } = await connection.query(
            'SELECT * FROM veiculo WHERE id = $1',
            [id]
        );

        if (!rows[0]) {
            return null;
        }

        return new Veiculo({
            id: rows[0].id,
            status_veiculo: rows[0].status_veiculo,
            capacidade_veiculo: rows[0].capacidade_veiculo,
            placa: rows[0].placa,
            numero_veiculo: rows[0].numero_veiculo
        });

    }

    static async buscarPorPlaca(placa: string) {

        const { rows } = await connection.query(
            'SELECT * FROM veiculo WHERE placa = $1',
            [placa]
        );

        if (!rows[0]) {
            return null;
        }

        return new Veiculo({
            id: rows[0].id,
            status_veiculo: rows[0].status_veiculo,
            capacidade_veiculo: rows[0].capacidade_veiculo,
            placa: rows[0].placa,
            numero_veiculo: rows[0].numero_veiculo
        });

    }

    static async contar(): Promise<number> {
        
    const result = await connection.query(
        `SELECT COUNT(*) AS total FROM veiculo`
    );

    return Number(result.rows[0].total);
    }

}