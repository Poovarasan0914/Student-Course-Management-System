import { Request, Response, NextFunction } from 'express';

interface CustomError extends Error {
    kind?: string;
    code?: number;
    errors?: { [key: string]: { message: string } };
}

const errorHandler = (err: CustomError, req: Request, res: Response, next: NextFunction): void => {
    let statusCode = res.statusCode === 200 ? 500 : res.statusCode;
    let message = err.message;

    if (err.name === 'CastError' && err.kind === 'ObjectId') {
        statusCode = 404;
        message = 'Resource not found';
    }

    if (err.code === 11000) {
        statusCode = 400;
        message = 'Duplicate field value entered';
    }

    if (err.name === 'ValidationError' && err.errors) {
        statusCode = 400;
        message = Object.values(err.errors).map(val => val.message).join(', ');
    }

    res.status(statusCode).json({
        message,
        stack: process.env.NODE_ENV === 'production' ? null : err.stack
    });
};

export default errorHandler;
