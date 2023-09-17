import { body } from 'express-validator';

const postCreateValidation = [
    body('title', 'The title must be at least 3 characters long and should be a string').isLength({min:3}).isString(),
    body('text', 'The text must be at least 10 characters long and should be a string').isLength({ min: 10 }).isString(),
    body('tags', 'Incorrect tag format (specify array)').optional().isArray(),
    body('avatarUrl', 'Invalid link to the image').optional().isURL(),
];

export default postCreateValidation;