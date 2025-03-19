import jwt from 'jsonwebtoken';

export function isAuthenticated(req, res, next) {
    try {
        const { authorization } = req.headers;
        const [, token] = authorization.split(' ');
        const { userId } = jwt.verify(token, process.env.JWT_SECRET);

        req.userId = userId;

        next();

    } catch (error) {
        res.status(401).json({ auth: false, message: 'Unauthorized. Token invalid.' });
    }
}