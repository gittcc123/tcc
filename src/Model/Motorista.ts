import { connection } from "../Infra/Connection";
import { Usuario } from "./Usuario";

export class Motorista {

    id: number;
    usuario: Usuario;
    telefone: string;
    ativo: boolean;

    constructor({
        id,
        usuario,
        telefone,
        ativo
    }: {
        id: number,
        usuario: Usuario,
        telefone: string,
        ativo: boolean
    }) {

        this.id = id;
        this.usuario = usuario;
        this.telefone = telefone;
        this.ativo = ativo;

    }

    /**
     * Cadastra um novo motorista.
     * A duplicidade é protegida também pelo banco através
     * da restrição UNIQUE em motorista.usuario_id.
     */
    static async cadastrar(motorista: Motorista) {

        await connection.query(
            `
        INSERT INTO motorista (
            usuario_id,
            telefone,
            ativo
        )
        VALUES ($1, $2, $3)
        `,
            [
                motorista.usuario.id,
                motorista.telefone,
                motorista.ativo
            ]
        );

    }

    /**
     * Verifica se um usuário já está cadastrado como motorista.
     */
    static async buscarPorUsuarioId(usuarioId: number) {

        const { rows } = await connection.query(
            `
        SELECT
            id,
            usuario_id,
            telefone,
            ativo
        FROM motorista
        WHERE usuario_id = $1
        LIMIT 1
        `,
            [usuarioId]
        );

        return rows[0] || null;

    }

    /**
     * Verifica se um usuário já é motorista,
     * ignorando o próprio motorista durante uma edição.
     */
    static async buscarPorUsuarioIdIgnorandoMotorista(
        usuarioId: number,
        motoristaId: number
    ) {

        const { rows } = await connection.query(
            `
        SELECT
            id,
            usuario_id,
            telefone,
            ativo
        FROM motorista
        WHERE usuario_id = $1
          AND id <> $2
        LIMIT 1
        `,
            [
                usuarioId,
                motoristaId
            ]
        );

        return rows[0] || null;

    }

    /**
     * Busca todos os usuários e informa quais já são motoristas.
     * Isso permite que a tela de cadastro desabilite
     * quem já está cadastrado.
     */
    static async buscarUsuariosParaMotorista() {

        const { rows } = await connection.query(
            `
        SELECT
            u.id,
            u.nome,
            u.email,
            t.nome AS tipo,

            CASE
                WHEN m.id IS NOT NULL THEN true
                ELSE false
            END AS "jaMotorista"

        FROM usuario u

        INNER JOIN tipo_usuario t
            ON u.tipo = t.id

        LEFT JOIN motorista m
            ON m.usuario_id = u.id

        ORDER BY u.nome ASC
        `
        );

        return rows;

    }

    /**
     * Lista todos os motoristas com seus respectivos usuários.
     */
    static async buscarTodos() {

        const { rows } = await connection.query(`
        SELECT
            m.id AS id_motorista,
            m.telefone,
            m.ativo,

            u.id AS id_usuario,
            u.nome,
            u.email,
            u.senha,
            u.criado_em,

            t.id AS id_tipo,
            t.nome AS nome_tipo,
            t.descricao

        FROM motorista m

        INNER JOIN usuario u
            ON m.usuario_id = u.id

        INNER JOIN tipo_usuario t
            ON u.tipo = t.id

        ORDER BY u.nome ASC
    `);

        return rows.map((row: any) => new Motorista({

            id: row.id_motorista,

            usuario: new Usuario({
                id: row.id_usuario,
                nome: row.nome,
                email: row.email,
                senha: row.senha,

                tipo: {
                    id: row.id_tipo,
                    nome: row.nome_tipo,
                    descricao: row.descricao
                },

                criadoEm: row.criado_em
            }),

            telefone: row.telefone,
            ativo: row.ativo

        }));

    }

    /**
     * Atualiza os dados do motorista.
     */
    static async atualizar(motorista: Motorista) {

        await connection.query(
            `
        UPDATE motorista
        SET
            usuario_id = $1,
            telefone = $2,
            ativo = $3
        WHERE id = $4
        `,
            [
                motorista.usuario.id,
                motorista.telefone,
                motorista.ativo,
                motorista.id
            ]
        );

    }

    /**
     * Exclui um motorista pelo ID.
     */
    static async deletarPorId(id: string) {

        await connection.query(
            `
        DELETE FROM motorista
        WHERE id = $1
        `,
            [id]
        );

    }

    /**
     * Busca um motorista pelo ID.
     */
    static async buscarPorId(id: string) {

        const { rows } = await connection.query(
            `
        SELECT
            m.id AS id_motorista,
            m.telefone,
            m.ativo,

            u.id AS id_usuario,
            u.nome,
            u.email,
            u.senha,
            u.criado_em,

            t.id AS id_tipo,
            t.nome AS nome_tipo,
            t.descricao

        FROM motorista m

        INNER JOIN usuario u
            ON m.usuario_id = u.id

        INNER JOIN tipo_usuario t
            ON u.tipo = t.id

        WHERE m.id = $1
        `,
            [id]
        );

        if (!rows[0]) {
            return null;
        }

        return new Motorista({

            id: rows[0].id_motorista,

            usuario: new Usuario({
                id: rows[0].id_usuario,
                nome: rows[0].nome,
                email: rows[0].email,
                senha: rows[0].senha,

                tipo: {
                    id: rows[0].id_tipo,
                    nome: rows[0].nome_tipo,
                    descricao: rows[0].descricao
                },

                criadoEm: rows[0].criado_em
            }),

            telefone: rows[0].telefone,
            ativo: rows[0].ativo

        });

    }
}
