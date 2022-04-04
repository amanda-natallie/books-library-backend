import jwt from "jsonwebtoken";

export default (req, res, next) => {
    const { refreshToken } = req.body;
    jwt.verify(refreshToken, process.env.REFRESHTOKEN_SECRET_KEY, (err, user) => {
        if (err) return res.status(401).json({ msg: 'refreshToken invalid or expired' });

        req.user = user;
        return next();
    });
}