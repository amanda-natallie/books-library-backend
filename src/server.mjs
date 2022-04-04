import express from 'express';
import logger from 'morgan';
import cors from 'cors';
import mongoose from 'mongoose';
import 'dotenv/config';
import route from './route.mjs';
import { errorHandler } from './middleware/errorHandler.mjs';

const app = express();

mongoose.connect(process.env.MONGO_URL);
const db = mongoose.connection;
db.on('error', () => console.log('__mongo error'));
db.once('open', () => {
    console.log('__mongo connected')

    app.use(cors());
    app.use(logger('dev'));
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));
    app.use(route);
    app.use(errorHandler);

    const PORT = process.env.PORT;
    app.listen(PORT, () => console.log(`__listening on ${PORT}`));
});
