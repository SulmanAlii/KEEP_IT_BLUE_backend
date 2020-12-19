const express = require('express');

const router = express.Router();
const multer = require('multer');
const evento = require('../models/evento');
const {sequelize,eventoTable}  = require('../db');

//multer es un plugin que facilita la lectura de archivos procedentes de forms
//aquí se inicializa, indicando que la carpeta es 'uploads'
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads')
    },
    filename: function (req, file, cb) {
        //definimos que los nombres de foto tendrán como prefijo el timestamp actual
        cb(null, Date.now() + '-' + file.originalname)
    }
})
const upload = multer({ storage: storage }).single('file');



router.get("/", async (req, res) => {
    res.send('WELCOME')
})

router.get("/evento", async (req, res) => {
    const getEventos = await eventosTable.findAll()
    res.send(getEventos)
})

router.post("/evento", (req, res) => {
    if (!req.body) {
        res.send("Completa todos los datos")
    }

    upload(req, res, function (err) {
        if (err instanceof multer.MulterError) {
            return res.status(500).json(err)
        } else if (err) {
            return res.status(500).json(err)
        }

        const newEvento = {
            nomEvent: req.body.nomEvent,
            nomPersona: req.body.nomPersona,
            descripcioEvent: req.body.descripcioEvent,
            data : req.body.fecha,
            tipoEvent: req.body.tipoEvent,
            foto: req.file.filename,
            nomplatja : req.body.nomplatja,
            idcomarca : req.body.idcomarca,
            nomcomarca :req.body.nomcomarca,
        }



        eventoTable.create(newEvento)
            .then(item => res.json({ item }))
            .catch(err => res.json(err));
    })
})




module.exports = router;