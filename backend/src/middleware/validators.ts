import { Request, Response, NextFunction } from 'express';

export const validateSignup = (req: Request, res: Response, next: NextFunction): void => {
    const { firstName, lastName, email, password } = req.body;

    const errors: string[] = [];

    if (!firstName || firstName.trim() === '') {
        errors.push('First name is required');
    }

    if (!lastName || lastName.trim() === '') {
        errors.push('Last name is required');
    }

    if (!email || email.trim() === '') {
        errors.push('Email is required');
    } else if (!/\S+@\S+\.\S+/.test(email)) {
        errors.push('Invalid email format');
    }

    if (!password) {
        errors.push('Password is required');
    } else if (password.length < 6) {
        errors.push('Password must be at least 6 characters');
    }

    if (errors.length > 0) {
        res.status(400).json({ message: errors.join(', ') });
        return;
    }

    next();
};

export const validateLogin = (req: Request, res: Response, next: NextFunction): void => {
    const { email, password } = req.body;

    const errors: string[] = [];

    if (!email || email.trim() === '') {
        errors.push('Email is required');
    }

    if (!password) {
        errors.push('Password is required');
    }

    if (errors.length > 0) {
        res.status(400).json({ message: errors.join(', ') });
        return;
    }

    next();
};

export const validateCourse = (req: Request, res: Response, next: NextFunction): void => {
    const { title, description, duration, price } = req.body;

    const errors: string[] = [];

    if (!title || title.trim() === '') {
        errors.push('Course title is required');
    }

    if (!description || description.trim() === '') {
        errors.push('Course description is required');
    }

    if (!duration || duration.trim() === '') {
        errors.push('Course duration is required');
    }

    if (!price) {
        errors.push('Course price is required');
    }

    if (errors.length > 0) {
        res.status(400).json({ message: errors.join(', ') });
        return;
    }

    next();
};
