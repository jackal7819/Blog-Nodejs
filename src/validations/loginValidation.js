import { body } from 'express-validator';

const loginValidation = [
    body('email').isEmail(),
    body('password').isLength({ min: 5 }),
];

export default loginValidation;