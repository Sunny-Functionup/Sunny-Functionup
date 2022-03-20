const jwt = require('jsonwebtoken')

const middleware = async (req, res, next) => {
    try {
        const token = req.header('x-api-key')
        if (!token) {
            res.status(403).send({ status: false, message: ` token request missing here` })
            return;
        }

        const decodedtoken = await jwt.verify(token, 'functionup-thorium')

        if (!decodedtoken) {
            res.status(403).send({ status: false, message: `invalid authenticated token in request body` })
            return;
        }

        req.authorId = decodedtoken.authorId;

        next()
    } catch (err) {
        console.error(`error ${err.message}`)
        res.status(500).send({ status: false, message: err.message })
    }
}

module.exports = middleware