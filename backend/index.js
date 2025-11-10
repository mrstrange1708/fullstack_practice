const express = require('express')
const dotenv = require('dotenv')
dotenv.config()
const { PrismaClient } = require('@prisma/client')
const prisma =  new PrismaClient()
const bcrypt = require('bcrypt')
const port = process.env.PORT
const app = express()
const JWT = require('jsonwebtoken')
const JWT_SECRET = process.env.JWT_SECRET
const cors = require('cors')
const middilware = require('./middleware')
app.use(express.json())

app.use(cors({
    origin : 'http://localhost:5173',
    credentials : true
}))

app.post('/api/signup' ,async (req ,res)=>{
    let { name , email , password } = req.body
    if(!name || !email || !password){
        return res.status(400).json({"error" : "Missing Creadintials"})
    }
    let user = await prisma.users.findUnique({
        where : {
            email
        }
    })
    if(user){
        res.status(400).json({"error" : "User already exits"})
    }
    let hashed = await bcrypt.hash(password , 10)
    let data = await prisma.users.create({
        data : {
            email , name , password : hashed
        }
    })
    res.status(200).json({
        "status" : 'success',
        "Data" : data
    })

})

app.post('/api/login' ,async (req ,res)=>{
    let { email , password } = req.body
    if(!email || !password){
        res.status(400).json({"error" : "Missing Creadintials"})
    }
    let user = await prisma.users.findUnique({
        where : {
            email
        }
    })
    if(!user){
        res.status(400).json({"error" : "User Not Found"})
    }
    isMatched = await bcrypt.compare(password , user.password)
    if(!isMatched){
        res.status(400).json({"error" : "Invaild Crendentials"})
    }

    let token = JWT.sign({user : user.id} , JWT_SECRET , {expiresIn : '7d'})

    res.status(200).json({
        "status" : 'success',
        "Data" : user,
        'Token' : token
    })

})



app.get('/api/users' , middilware , async (req ,res)=>{
    let data = await prisma.users.findMany()
    if(!data){
        res.status(400).json({error : "No Users"})
    }
    res.status(200).json(data)
})
app.get('/' ,(req ,res)=>{
    res.status(200).send(`hello world`)
})

app.listen(port , ()=>{
    console.log(`connected on ${port}`)
})
