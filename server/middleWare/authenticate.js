import jwt from 'jsonwebtoken';

const authenticateJWT = (req, res, next) => {
    const token = req.headers['authorization']?.split(' ')[1];  // Get token from 'Authorization' header

    if (!token) {
        return res.status(403).json({ message: 'No token provided.' });
    }

    jwt.verify(token, 'your-secret-key', (err, user) => {
        if (err) {
            return res.status(403).json({ message: 'Invalid token.' });
        }
        req.user = user;  // Attach the user info to the request object
        next();  // Proceed to the next middleware or route handler
    });
};

export default authenticateJWT;
