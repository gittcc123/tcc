
import { connection } from "../Infra/Connection";

export class TipoUsuario {
    id: number;
    nome: string;
    descricao: string;

    constructor(id: number, nome: string, descricao: string) {
        this.id = id;
        this.nome = nome;
        this.descricao = descricao;
    }

    static async buscarTodos(): Promise<TipoUsuario[]> {
        const { rows } = await connection.query(
            "SELECT id, nome, descricao FROM tipo_usuario"
        );

        return rows.map(
            (row: { id: number; nome: string; descricao: string }) =>
                new TipoUsuario(row.id, row.nome, row.descricao)
        );
    }

    static async buscarPorId(id: number): Promise<TipoUsuario | null> {
        const { rows } = await connection.query(
            "SELECT id, nome, descricao FROM tipo_usuario WHERE id = $1",
            [id]
        );

        if (rows.length === 0) return null;

        const row = rows[0];
        return new TipoUsuario(row.id, row.nome, row.descricao);
    }

    static async buscarPorNome(nome: string): Promise<TipoUsuario | null> {
        const { rows } = await connection.query(
            "SELECT id, nome, descricao FROM tipo_usuario WHERE nome = $1",
            [nome]
        );

        if (rows.length === 0) return null;

        const row = rows[0];
        return new TipoUsuario(row.id, row.nome, row.descricao);
    }
}
