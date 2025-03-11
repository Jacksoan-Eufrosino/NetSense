import jwt from 'jsonwebtoken';

export function isAuthenticated(req, res, next) {
    try {
        const { authorization } = req.headers;

        const [, token] = authorization.split(' ');

        const { userID } = jwt.verify(token, process.env.JWT_SECRET);

        req.userID = userID;

        next();
    } catch( error ){
        res.status(401).send({ auth: false, massage: 'Token Invalid.' });
    }
}