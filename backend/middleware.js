const JWT = require('jsonwebtoken')
const JWT_SECRET = process.env.JWT_SECRET


function Middlerware(req , res, next){
    let authtoken = req.headers['authorization']
    if(!authtoken){
        res.status(400).json({ error : 'Token Missing'})
    }
    let user  = JWT.verify(authtoken , JWT_SECRET)
    if(!user){
        res.status(403).json({ error : 'Token Invaild'})
    }
    req.user = user
    next()
}

module.exports = Middlerware