const jwt = require("jsonwebtoken");

exports.authentication = (req, res, next) => {

    let authHeader = req.headers.authorization;

    if(!authHeader) { res.status(401).send({ result: false, message: "Unauthorized!"}); return; }

    let token = authHeader.split(' ')[1];

    jwt.verify(token, process.env.JWT_TOKEN, (err, user) => {
        if(err) { res.status(403).send({ result: false, message: "Unauthorized!"}); return; }

        req.user = user;
        next();
    });

}