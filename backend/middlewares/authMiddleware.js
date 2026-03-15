const jwt = require('jsonwebtoken');

exports.protect = (req, res, next) => {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
        return res.status(401).json({ message: 'Not authorized, no token' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        res.status(401).json({ message: 'Not authorized, token failed' });
    }
};

exports.optionalProtect = (req, res, next) => {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
        return next();
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        // If token is invalid, just proceed as guest
        next();
    }
};

exports.authorize = (...roles) => {
    return (req, res, next) => {
        // If not authenticated, guest can't reach certain roles
        if (!req.user || !roles.includes(req.user.role)) {
            return res.status(403).json({
                message: `User role ${req.user?.role || 'guest'} is not authorized to access this route`
            });
        }
        next();
    };
};
