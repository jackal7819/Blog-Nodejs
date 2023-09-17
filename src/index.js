import { create, remove, update } from './controllers/PostController.js';
import { getAll, getLastTags, getOne } from './controllers/PostController.js';
import { getMe, login, register } from './controllers/UserController.js';

import bearerToken from 'express-bearer-token';
import checkAuth from './utils/checkAuth.js';
import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import fs from 'fs';
import { getPostsByNew } from './controllers/PostController.js';
import { getPostsByPopular } from './controllers/PostController.js';
import { getPostsByTag } from './controllers/PostController.js';
import { getPostsByTitle } from './controllers/PostController.js';
import handleValidation from './utils/handleValidation.js';
import loginValidation from './validations/loginValidation.js';
import mongoose from 'mongoose';
import multer from 'multer';
import postCreateValidation from './validations/postCreateValidation.js';
import registerValidation from './validations/loginValidation.js';

dotenv.config();

mongoose
    .connect(process.env.MONGODB_URL)
    .then(() => console.log('MongoDB connected'))
    .catch((error) => {
        console.error('Error connecting', error);
        process.exit(1);
    });

const app = express();
app.use(bearerToken());

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        if (!fs.existsSync('uploads')) {
            fs.mkdirSync('uploads');
        }
        cb(null, 'uploads');
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname);
    },
});

const upload = multer({ storage });

app.use(express.json());
app.use(cors());
app.use('/uploads', express.static('uploads'));

app.post('/auth/login', loginValidation, handleValidation, login);
app.post('/auth/register', registerValidation, handleValidation, register);
app.post('/upload', checkAuth, upload.single('image'), (req, res) => {
    res.json({ url: `/uploads/${req.file.originalname}` });
});
app.post('/posts', checkAuth, postCreateValidation, handleValidation, create);

app.get('/auth/me', checkAuth, getMe);
app.get('/posts', getAll);
app.get('/posts/new', getPostsByNew);
app.get('/posts/popular', getPostsByPopular);
app.get('/posts/title', getPostsByTitle);
app.get('/posts/tags/:tag', getPostsByTag);
app.get('/posts/:id', getOne);

app.delete('/posts/:id', checkAuth, remove);

app.patch(
    '/posts/:id',
    checkAuth,
    postCreateValidation,
    handleValidation,
    update
);

app.get('/tags', getLastTags);

app.listen(process.env.PORT || 5555, () => {
    console.log('Server is running on port 5555');
});
