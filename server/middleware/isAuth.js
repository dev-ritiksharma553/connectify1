
const jwt = require('jsonwebtoken')

const isAuth = async (req, res, next) => {
    try {
        const token = req.cookies?.token;
        if (!token) {
            return res.status(400).json({
                message: "token not found"
            })
        }
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        if (!decoded) {
            return res.status(400).json({
                message: "token unauthorize"
            })
        }
        req.id = decoded.id;
        next()
    } catch (error) {
        console.log(error);
    }


}
module.exports = isAuth;