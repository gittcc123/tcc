import multer from "multer";
import path from "path";
import fs from "fs";

const pastaPerfis = path.join(
    process.cwd(),
    "public",
    "uploads",
    "perfis"
);

// Cria a pasta caso ela não exista
if (!fs.existsSync(pastaPerfis)) {
    fs.mkdirSync(pastaPerfis, {
        recursive: true
    });
}

const storage = multer.diskStorage({

    destination: (req, file, cb) => {
        cb(null, pastaPerfis);
    },

    filename: (req, file, cb) => {

        const usuario = (req.session as any).usuario;

        // Verifica se o usuário está logado
        if (!usuario) {
            return cb(
                new Error("Usuário não autenticado"),
                ""
            );
        }

        const extensao = path
            .extname(file.originalname)
            .toLowerCase();

        // Extensões de imagens que o sistema aceita
        const extensoesPermitidas = [
            ".jpg",
            ".jpeg",
            ".png",
            ".webp"
        ];

        /*
         * Remove a foto antiga do usuário.
         *
         * Como o arquivo é salvo usando o ID do usuário,
         * pode existir, por exemplo:
         *
         * 15.jpg
         * 15.png
         * 15.webp
         *
         * Antes de salvar a nova foto, removemos qualquer
         * uma dessas versões.
         */
        for (const ext of extensoesPermitidas) {

            const fotoAntiga = path.join(
                pastaPerfis,
                `${usuario.id}${ext}`
            );

            if (fs.existsSync(fotoAntiga)) {
                try {
                    fs.unlinkSync(fotoAntiga);
                } catch (erro) {
                    console.error(
                        "Erro ao remover foto antiga:",
                        erro
                    );
                }
            }
        }

        /*
         * Salva a nova foto usando o ID do usuário.
         *
         * Exemplo:
         * usuário 15 + .png
         * => 15.png
         */
        cb(
            null,
            `${usuario.id}${extensao}`
        );
    }

});

const upload = multer({

    storage,

    // Limite máximo de 5 MB
    limits: {
        fileSize: 5 * 1024 * 1024
    },

    // Tipos de arquivo permitidos
    fileFilter: (req, file, cb) => {

        const tiposPermitidos = [
            "image/jpeg",
            "image/jpg",
            "image/png",
            "image/webp"
        ];

        if (tiposPermitidos.includes(file.mimetype)) {

            cb(null, true);

        } else {

            cb(
                new Error(
                    "Apenas imagens JPG, JPEG, PNG ou WEBP são permitidas."
                )
            );

        }
    }

});

export default upload;
