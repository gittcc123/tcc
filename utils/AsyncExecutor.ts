import { NextFunction, Request, Response } from "express";

export function asyncExecutor(handler: (req: Request, res: Response, next?: NextFunction) => Promise<any> | any) {
    return function(request: Request, response: Response, next?: NextFunction) {
        try {
            return handler(request, response, next);
        } catch (error) {
            console.error(`Erro na rota ${request.method} ${request.url}:`, error);
            return response.status(500).json({ error: 'Ocorreu um erro interno no servidor.' });
        }
    }
}