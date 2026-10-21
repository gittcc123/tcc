import { connection } from "../Infra/Connection";

export class Rota {

    id?: number;
    descricao: string;
    tempo_medio: number;

    constructor({
        id,
        descricao,
        tempo_medio
    }: {
        id?: number;
        descricao: string;
        tempo_medio: number;
    }) {

        this.id = id;
        this.descricao = descricao;
        this.tempo_medio = tempo_medio;
    }

    // ==========================================
    // CADASTRAR
    // ==========================================

    static async cadastrar(rota: Rota): Promise<void> {

        await connection.query(
            `
            INSERT INTO rota
            (
                descricao,
                tempo_medio
            )
            VALUES ($1, $2)
            `,
            [
                rota.descricao,
                rota.tempo_medio
            ]
        );
    }

    // ==========================================
    // LISTAR
    // ==========================================

    static async buscarTodos(): Promise<Rota[]> {

        const { rows } = await connection.query(
            `
            SELECT
                id,
                descricao,
                tempo_medio
            FROM rota
            ORDER BY id
            `
        );

        return rows.map((row: any) => {

            return new Rota({
                id: row.id,
                descricao: row.descricao,
                tempo_medio: Number(row.tempo_medio)
            });

        });
    }

    // ==========================================
    // BUSCAR POR ID
    // ==========================================

    static async buscarPorId(id: string): Promise<Rota | null> {

        const { rows } = await connection.query(
            `
            SELECT
                id,
                descricao,
                tempo_medio
            FROM rota
            WHERE id = $1
            `,
            [id]
        );

        if (!rows[0]) {
            return null;
        }

        return new Rota({
            id: rows[0].id,
            descricao: rows[0].descricao,
            tempo_medio: Number(rows[0].tempo_medio)
        });
    }

    // ==========================================
    // BUSCAR POR DESCRIÇÃO
    // ==========================================

    static async buscarPorDescricao(
        descricao: string,
        idIgnorar?: number
    ): Promise<Rota | null> {

        let query = `
            SELECT
                id,
                descricao,
                tempo_medio
            FROM rota
            WHERE LOWER(TRIM(descricao)) = LOWER(TRIM($1))
        `;

        const valores: any[] = [descricao];

        if (idIgnorar !== undefined) {

            query += `
                AND id <> $2
            `;

            valores.push(idIgnorar);
        }

        query += ` LIMIT 1`;

        const { rows } = await connection.query(
            query,
            valores
        );

        if (!rows[0]) {
            return null;
        }

        return new Rota({
            id: rows[0].id,
            descricao: rows[0].descricao,
            tempo_medio: Number(rows[0].tempo_medio)
        });
    }

    // ==========================================
    // ATUALIZAR
    // ==========================================

    static async atualizar(rota: Rota): Promise<void> {

        await connection.query(
            `
            UPDATE rota
            SET
                descricao = $1,
                tempo_medio = $2
            WHERE id = $3
            `,
            [
                rota.descricao,
                rota.tempo_medio,
                rota.id
            ]
        );
    }

    // ==========================================
    // EXCLUIR
    // ==========================================

    static async deletarPorId(id: string): Promise<void> {

        const client = await connection.connect();

        try {

            await client.query('BEGIN');

            /*
             * Primeiro remove todos os vínculos
             * da rota com os pontos.
             */
            await client.query(
                `
                DELETE FROM ponto_rota
                WHERE rota_id = $1
                `,
                [id]
            );

            /*
             * Depois remove a rota.
             */
            const resultado = await client.query(
                `
                DELETE FROM rota
                WHERE id = $1
                `,
                [id]
            );

            if (resultado.rowCount === 0) {

                throw new Error(
                    'Rota não encontrada.'
                );
            }

            await client.query('COMMIT');

        } catch (error) {

            await client.query('ROLLBACK');

            console.error(
                'Erro ao excluir rota:',
                error
            );

            throw error;

        } finally {

            client.release();
        }
    }

    // ==========================================
    // CONTAR
    // ==========================================

    static async contar(): Promise<number> {

        const result = await connection.query(
            `
            SELECT COUNT(*) AS total
            FROM rota
            `
        );

        return Number(
            result.rows[0].total
        );
    }
}