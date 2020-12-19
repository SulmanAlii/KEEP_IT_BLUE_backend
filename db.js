require('dotenv').config()
const Sequelize = require('sequelize');
const opinion = require('./models/opinion');
const comarca = require('./models/comarca');
const ubicacion = require('./models/ubicacion');
const user = require('./models/users');
const comarca_real= require('./models/comarca2')
const evento = require('./models/evento')



const sequelize = new Sequelize('c1kvn8eus4qw17m0',process.env.DB_USERNAME,process.env.DB_PASSWORD, {
    host : 'cvktne7b4wbj4ks1.chr7pe7iynqr.eu-west-1.rds.amazonaws.com',
    dialect: 'mysql'
})

// const sequelize = new Sequelize('mapa','root','MySQLDatabase@1', {
//     host : 'localhost',
//     dialect: 'mysql'
// })

const opinionTable = opinion(sequelize,Sequelize);
const comarcaTable = comarca(sequelize,Sequelize);
const ubicacionTable = ubicacion(sequelize,Sequelize);
const users = user(sequelize,Sequelize);
const comarca2 = comarca_real(sequelize,Sequelize);
const eventoTable = evento(sequelize,Sequelize)



sequelize.sync()
.then((db) => {
    console.log("Conectado con db mapa");
}).catch((err) => {
    console.log("Error al crear base de datos" + err);
});


module.exports = {sequelize, opinionTable, comarcaTable, ubicacionTable,users,comarca2,eventoTable};
