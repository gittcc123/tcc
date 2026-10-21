import { connection } from "../infra/Connection";

export class TipoUsuario {
    id: number;
    nome: string;
    descricao: string;

    constructor(id: number, nome: string, descricao: string) {
        this.id = id;
        this.nome = nome;
        this.descricao = descricao;
    }

    static async buscarTodos() {
        const { rows } = await connection.query('SELECT * FROM tipo_usuario');
        return rows.map(({ id, nome, descricao }) => new TipoUsuario(id, nome, descricao));
    }

    static async buscarPorId(id: number) {
        const { rows } = await connection.query(
            'SELECT * FROM tipo_usuario WHERE id = $1;',
            [id]
        );
        if (!rows[0]) return null;
        return new TipoUsuario(rows[0].id, rows[0].nome, rows[0].descricao);
    }

    static async buscarPorNome(nome: string) {
        const { rows } = await connection.query(
            'SELECT * FROM tipo_usuario WHERE nome = $1;', 
            [nome]
        );
        if (!rows[0]) return null;
        return new TipoUsuario(rows[0].id, rows[0].nome, rows[0].descricao);
    }
}
