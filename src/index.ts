import express from 'express';
import session from 'express-session';
import dotenv from 'dotenv';
import os from 'os';

import { connection } from './Infra/Connection';

import { usuarioRoutes } from './routes/UsuarioRoutes';
import { dashboardRoutes } from './routes/DashboardRoutes';
import { alertaRoutes } from './routes/AlertaRoutes';
import { localizacaoVeiculoRoutes } from './routes/LocalizacaoVeiculoRoutes';
import { veiculoRoutes } from './routes/VeiculoRoutes';
import { motoristaRoutes } from './routes/MotoristaRoutes';
import { rotaRoutes } from './routes/RotaRoutes';
import { pontoRotaRoutes } from './routes/PontoRotaRoutes';
import { pontoRoutes } from './routes/PontoRoutes';
import { escalaRoutes } from './routes/EscalaRoutes';
import { escalaMotoristaRoutes } from './routes/EscalaMotoristaRoutes';
import { cidadeRoutes } from './routes/CidadeRoutes';
import { estadoRoutes } from './routes/EstadoRoutes';

dotenv.config();

const app = express();

const PORT = Number(process.env.PORT) || 3333;

// Necessário quando o app roda atrás de proxy/HTTPS (Render, Railway etc.)
app.set('trust proxy', 1);

// Retorna os IPs da máquina na rede local (Wi-Fi) para acessar pelo celular
function obterIPsLocais(): string[] {
    const ips: string[] = [];
    const interfaces = os.networkInterfaces();

    for (const nome of Object.keys(interfaces)) {
        for (const info of interfaces[nome] || []) {
            if (info.family === 'IPv4' && !info.internal) {
                ips.push(info.address);
            }
        }
    }

    return ips;
}

// ==========================================
// CONFIGURAÇÕES DO EXPRESS
// ==========================================

app.set('view engine', 'ejs');
app.set('views', './src/views');

// ==========================================
// MIDDLEWARES
// ==========================================

app.use(express.static('public'));

app.use(express.urlencoded({
    extended: false
}));

app.use(express.json());

// ==========================================
// SESSÃO
// ==========================================

app.use(
    session({
        secret: process.env.SESSION_SECRET || 'bus-status',
        resave: false,
        saveUninitialized: false,
        cookie: {
            maxAge: 1000 * 60 * 60,
            httpOnly: true,
            sameSite: 'lax',
            secure: process.env.NODE_ENV === 'production'
        }
    })
);

// ==========================================
// ROTA PRINCIPAL
// ==========================================

app.get('/', (req, res) => {
    res.render('index', {
        message: 'Hello'
    });
});

// ==========================================
// ROTAS DO SISTEMA
// ==========================================

app.use(usuarioRoutes);

app.use(dashboardRoutes);

app.use(alertaRoutes);

app.use(localizacaoVeiculoRoutes);

app.use(veiculoRoutes);

app.use(motoristaRoutes);

app.use(rotaRoutes);

app.use(pontoRotaRoutes);

app.use(pontoRoutes);

app.use(escalaRoutes);

app.use(escalaMotoristaRoutes);

app.use(cidadeRoutes);

app.use(estadoRoutes);

// ==========================================
// TRATAMENTO DE ERROS
// ==========================================

app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {

    
    console.error('ERRO NO SERVIDOR');
    console.error(err);

    if (res.headersSent) {
        return next(err);
    }

    res.status(500).send(`
        <div style="
            font-family: Arial, sans-serif;
            padding: 40px;
            text-align: center;
        ">
            <h1 style="color: #7a1f1f;">
                Erro interno do servidor
            </h1>

            <p>
                Ocorreu um erro ao processar sua solicitação.
            </p>

            <a
                href="/dashboard"
                style="
                    display: inline-block;
                    margin-top: 20px;
                    padding: 12px 20px;
                    background: #7a1f1f;
                    color: white;
                    text-decoration: none;
                    border-radius: 6px;
                "
            >
                Voltar para o Dashboard
            </a>
        </div>
    `);
});

// ==========================================
// CONEXÃO COM BANCO E INICIALIZAÇÃO
// ==========================================

async function iniciarServidor() {

    try {

        await connection.connect();

        console.log('Conectado ao banco de dados com sucesso!');

        app.listen(PORT, '0.0.0.0', () => {
            console.log('Bus Status iniciado com sucesso!');
            console.log(`No computador: http://localhost:${PORT}`);

            obterIPsLocais().forEach((ip) => {
                console.log(`No celular (mesmo Wi-Fi): http://${ip}:${PORT}`);
            });
        });

    } catch (err) {

        console.error('ERRO AO CONECTAR AO BANCO DE DADOS');
        console.error(err);

        process.exit(1);
    }
}

iniciarServidor();