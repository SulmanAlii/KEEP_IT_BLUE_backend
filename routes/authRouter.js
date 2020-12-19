require('dotenv').config()
const app = require('express');
const bycrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
var {users} = require('../db');

const router = app.Router();

router.get('/', (req,res) => {
    res.send("REGISTER")
})

// Register
router.post('/signup' , (req,res) => {
    const name = req.body.nombre;
    const email = req.body.email;
    const password = req.body.password;


    if(!name || !email || !password){
        res.status(400).json({msg : "Introduce todos los datos"})
    }


    users.findOne({where : {email : email}})
    .then((user) => { 
        if(user) return res.status(400).json({msg : "Usuario ya registrado"});

        req.body.password = bycrypt.hashSync(req.body.password, 10);


        users.create(req.body)
        .then((user) => {
            jwt.sign({id : user.id}, process.env.SECRET_KEY, {expiresIn : "10h"}, (err,token) => {
                res.json({
                    token : token,
                user : {
                    id :user.id,
                    name : user.nombre,
                    email : user.email,
                }
                })
            })   
        }).catch((err) => {
            res.status(400).json({msg : "ERROR AL REGISTRARSE"})
        });

})
    
})


router.post('/login', (req,res) => {
    const email = req.body.email;
    const password = req.body.password;

    if(!email || !password){
        res.status(400).json({msg : "Completa todos los campos"})
    }


    users.findOne({where : {email:email}})
    .then(user => {
        if (!user) {
            res.status(400).json({msg : "usuario no existe"})
        }

       bycrypt.compare(password, user.password)
       .then(password => {if(!password) return res.status(400).json({msg : "La contraseña es incorrecta"});

           jwt.sign({id : user.id},process.env.SECRET_KEY,{expiresIn : "10h"},(err,token) => {
               res.json({
                token: token,
                user : {
                     name : user.nombre,
                     email : user.email
                }
               })
           })
       })
    })








})

module.exports = router;