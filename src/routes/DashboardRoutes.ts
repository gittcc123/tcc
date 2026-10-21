import { Router } from 'express';
import { DashboardController } from '../Controller/DashboardController';
import { authMiddleware } from '../middlewares/AuthMiddleware';
import { asyncExecutor } from '../../utils/AsyncExecutor';


const dashboardRoutes = Router();

dashboardRoutes.get('/dashboard', authMiddleware(['USUARIO', 'ADMIN', 'MOTORISTA']), asyncExecutor(DashboardController.carregarDashboard));

export {
    dashboardRoutes
}