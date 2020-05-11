const jwt = require('jsonwebtoken');
const config = require('config');

module.exports = function (req, res, next) {
    const token = req.header('Authorization');

    // Check if not token
    if (!token) {
        return res.status(401).json({ error: [{ msg: "Login to proceed" }] });
    }

    // Verify token
    try {
        jwt.verify(token, config.get('jwtSecret'), (error, decoded) => {
            if (error) {
                res.status(401).json({ error: [{ msg: "Login to proceed" }] });
            } else {
                req.user = decoded.user;
                next();
            }
        });
    } catch (err) {
        console.error('Something wrong with auth middleware');
        res.status(500).json({ error: [{ msg: "Server Error" }] });
    }
};