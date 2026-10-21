import { connection } from "../Infra/Connection";

export class Ponto {

    id?: number;
    localizacao: string;
    descricao: string;
    latitude: number;
    longitude: number;
    cidade: number;
    nomeCidade?: string;

    constructor({
        id,
        localizacao,
        descricao,
        latitude,
        longitude,
        cidade,
        nomeCidade
    }: {
        id?: number;
        localizacao: string;
        descricao: string;
        latitude: number;
        longitude: number;
        cidade: number;
        nomeCidade?: string;
    }) {

        this.id = id;
        this.localizacao = localizacao;
        this.descricao = descricao;
        this.latitude = latitude;
        this.longitude = longitude;
        this.cidade = cidade;
        this.nomeCidade = nomeCidade;
    }

    // ==========================================
    // CADASTRAR
    // ==========================================

    static async cadastrar(ponto: Ponto): Promise<void> {

        await connection.query(
            `
            INSERT INTO ponto
            (
                localizacao,
                descricao,
                latitude,
                longitude,
                cidade_id
            )
            VALUES ($1, $2, $3, $4, $5)
            `,
            [
                ponto.localizacao,
                ponto.descricao,
                ponto.latitude,
                ponto.longitude,
                ponto.cidade
            ]
        );
    }

    // ==========================================
    // LISTAR TODOS
    // ==========================================

    static async buscarTodos(): Promise<Ponto[]> {

        const { rows } = await connection.query(
            `
            SELECT
                p.id,
                p.localizacao,
                p.descricao,
                p.latitude,
                p.longitude,
                p.cidade_id,
                c.nome AS cidade_nome
            FROM ponto p
            LEFT JOIN cidade c
                ON c.id = p.cidade_id
            ORDER BY p.id
            `
        );

        return rows.map((row: any) => {

            return new Ponto({
                id: row.id,
                localizacao: row.localizacao,
                descricao: row.descricao,
                latitude: Number(row.latitude),
                longitude: Number(row.longitude),
                cidade: Number(row.cidade_id),
                nomeCidade: row.cidade_nome
            });

        });
    }

    // ==========================================
    // BUSCAR POR ID
    // ==========================================

    static async buscarPorId(id: string): Promise<Ponto | null> {

        const { rows } = await connection.query(
            `
            SELECT
                p.id,
                p.localizacao,
                p.descricao,
                p.latitude,
                p.longitude,
                p.cidade_id,
                c.nome AS cidade_nome
            FROM ponto p
            LEFT JOIN cidade c
                ON c.id = p.cidade_id
            WHERE p.id = $1
            `,
            [id]
        );

        if (!rows[0]) {
            return null;
        }

        return new Ponto({
            id: rows[0].id,
            localizacao: rows[0].localizacao,
            descricao: rows[0].descricao,
            latitude: Number(rows[0].latitude),
            longitude: Number(rows[0].longitude),
            cidade: Number(rows[0].cidade_id),
            nomeCidade: rows[0].cidade_nome
        });
    }

    // ==========================================
    // ATUALIZAR
    // ==========================================

    static async atualizar(ponto: Ponto): Promise<void> {

        await connection.query(
            `
            UPDATE ponto
            SET
                localizacao = $1,
                descricao = $2,
                latitude = $3,
                longitude = $4,
                cidade_id = $5
            WHERE id = $6
            `,
            [
                ponto.localizacao,
                ponto.descricao,
                ponto.latitude,
                ponto.longitude,
                ponto.cidade,
                ponto.id
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
             * Remove primeiro os vínculos
             * existentes entre o ponto e as rotas.
             */
            await client.query(
                `
                DELETE FROM ponto_rota
                WHERE ponto_id = $1
                `,
                [id]
            );

            /*
             * Agora o ponto pode ser excluído.
             */
            const resultado = await client.query(
                `
                DELETE FROM ponto
                WHERE id = $1
                `,
                [id]
            );

            if (resultado.rowCount === 0) {
                throw new Error('Ponto não encontrado');
            }

            await client.query('COMMIT');

        } catch (error) {

            await client.query('ROLLBACK');

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
            FROM ponto
            `
        );

        return Number(result.rows[0].total);
    }
}