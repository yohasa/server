const express = require('express')
const bodyParser = require('body-parser')
const jsonParser = bodyParser.json()
const jwt = require('jsonwebtoken')
const cors = require('cors')

let users = [
    {id:1,email:"doron",password:"123", role:"admin"},
    {id:2,email:"meir",password:"123", role:"member"}
]

const app = express()

app.use(cors())

function checkRole(role){
    return function (req,res,next){
        if(req.user && req.user.role == role)
            next()
        else
        res.status(403).send("Forbidden")
    }
}

function auth(req,res,next){
    if(req.header('authorization')){
        const token = req.header('authorization').replace("Bearer ", "")

        try {
            var decoded = jwt.verify(token, 'hello_world_from_ort_collage_hii');
            req.user = decoded
            next()
        } catch (error) {
            res.status(401).send("Invalid Token!!!!")
        }
        return
    }
    res.status(401).send("token not found")
}

app.get("/", (req,res)=>{
    res.send("hello world.!")
})


app.get("/profile", auth, (req,res)=>{
    res.json(req.user)
})

app.get("/api/products", auth, (req,res)=>{
    res.json("hello from products")
})

app.get("/api/users", auth, checkRole("admin"), (req,res)=>{
    res.json(users)
})

app.post("/api/login", jsonParser, (req,res)=>{
    
    const {email, password} = req.body

    const user = users.find(u=> u.email == email)
    if(!user){
        res.status(404).send("User with email:"+email+" not found.")
        return
    }
    if (password!=user.password){
        res.status(400).send("username or password invalid")
        return
    }
    const token = jwt.sign({ email: email, role: user.role }, 'hello_world_from_ort_collage_hii');
    res.json({token})
})



app.listen(8080, ()=> console.log("listen on port:8080"))

// app.put("/api/users/:id", auth, checkRole("admin"), (req,res)=>{
//     let id= req.params.id
//     let user = users.find(u=> u.id == id)
//     if(!user){
//         res.status(404).send("User with id:"+id+" not found.")
//         return
//     }
//     user.email = req.body.email
//     user.password = req.body.password
//     res.json(user)
// })

// app.delete("/api/users/:id", auth, checkRole, async("admin"), (req,res)=>{
//     let id= req.params.id;
//     await users.deleteOne({_id:id})
//     let user = await users.find(u=> u.id == id)
//     res.json(users)
// })
// app.post("/api/users", auth, checkRole("admin"), (req,res)=>{
//     let user = req.body
//     user.id = users.length + 1
//     users.push(user)
//     res.json(user)
// }   

// )
    