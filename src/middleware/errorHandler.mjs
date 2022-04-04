import express from 'express';
import createError from 'http-errors'

export const errorHandler = express.Router();

errorHandler.use(function (req, res, next) {
    next(createError(404));
});

errorHandler.use(function (err, req, res, next) {
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    res.status(err.status || 500);
    res.render('error');
});
