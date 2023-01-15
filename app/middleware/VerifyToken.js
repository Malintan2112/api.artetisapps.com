const jwt = require('jsonwebtoken')
const { errorResonse } = require('../controllers/JsonDefault.js')

const verifyToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    // if(token == null) return res.sendStatus(401);
    if (token == null) res.json(errorResonse('unauthorization'))

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
        if (err) return res.json(errorResonse('token expired'));
        req.email = decoded.email;
        next();
    })
}

module.exports = verifyToken