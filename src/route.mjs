import express from 'express';
import jwt from 'jsonwebtoken';
import User from './user/userSchema.mjs';
import userController from './user/userContoller.mjs';
import bookService from './book/bookService.mjs';
import authMiddleware from './middleware/authHandler.mjs';
import refreshTokenCheck from './middleware/refreshTokenCheck.mjs';

const router = express.Router();

router.use('/user', userController);
router.post('/user/:userId/book', authMiddleware, bookService.create);
router.post('/user/:userId/book/:bookId', authMiddleware, bookService.booked);
router.get('/book/free', bookService.listBookFree);
router.get('/book/booked', bookService.listBooked);
router.post('/token', refreshTokenCheck, async (req, res, next) => {
    const { refreshToken } = req.body;

    if (!refreshToken) return res.status(400).send('refreshToken is required!');

    const user = await User.findOne({ refresh_token: refreshToken }).select('_id name email password created_at token refresh_token')
    const userData = {
        _id: user._id,
        name: user.name,
        email: user.email,
        password: user.password,
        created_at: user.created_at
    }
    if (refreshToken === user.refresh_token) {
        const token = jwt.sign({ userData }, process.env.TOKEN_SECRET_KEY, { expiresIn: process.env.TOKEN_EXPIRATION_TIME });
        await User.updateOne({ user: user._id }, { token });

        return res.status(200).json({ token });
    } else {
        return res.status(401).send('Invalid token')
    }
})

export default router;