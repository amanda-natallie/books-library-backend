import jwt from "jsonwebtoken";

export default (req, res, next) => {
    try {
        const { auth } = req.headers;
        if (!auth) return res.status(401).json({ msg: 'token is required!' });
        const secretKey = process.env.TOKEN_SECRET_KEY;

        jwt.verify(auth, secretKey, (err, user) => {
            if (err) return res.status(401).json({ msg: 'token expired' });

            req.user = user;
            return next();
        });
    } catch (err) {
        return next(err);
    }
};