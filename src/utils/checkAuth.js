import jwt from 'jsonwebtoken';

const checkAuth = (req, res, next) => {
    const token = req.token;

    if (token) {
        try {
            const decoded = jwt.verify(token, 'secret123');
            req.userId = decoded._id;
            next();
        } catch (error) {
            return res.status(403).json({ message: 'Access Denied' });
        }
    } else {
        return res.status(403).json({ message: 'Access Denied' });
    }
};

export default checkAuth;
