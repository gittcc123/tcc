export function authMiddleware(tiposPermitidos: string[] = []) {
    return function (req: any, res: any, next: any) {
        if (!req.session?.usuario) {
            return res.redirect('/usuario/logar');
        }

        if (tiposPermitidos.length > 0 && !tiposPermitidos.includes(req.session.usuario.tipo)) {
            return res.redirect('/dashboard');
        }

        return next();
    }
}

