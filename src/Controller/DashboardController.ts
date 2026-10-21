import { Request, Response } from "express";
import { Veiculo } from "../Model/Veiculo";
import { Ponto } from "../Model/Ponto";
import { Rota } from "../Model/Rota";
import { Alerta } from "../Model/Alertas";

export class DashboardController {

    static async carregarDashboard(req: Request, res: Response) {

        const { usuario } = req.session as any;

        const totalVeiculos = await Veiculo.contar();
        const totalPontos = await Ponto.contar();
        const totalRotas = await Rota.contar();

        const alertas = await Alerta.buscarTodos();

        res.render('pages/dashboard', {
            usuario,
            titulo: 'Dashboard',
            totalVeiculos,
            totalPontos,
            totalRotas,
            alertas
        });
    }
}
