const express = require('express');
const Connections = require('./logic/connections');
const router = express.Router();

const connections = new Connections();

router.route('/')
    .get((req, res) => {
        connections.startSendingCurrentPlayers(req.io);
        res.json(connections.getRooms());
    })
    .post((req, res) => {
        connections.createRoom(req.io);
        res.send('ok');
    });

router.route('/mobile')
    .post((req, res) => {
        res.json(connections.connectMobile(req.body.mobileCode))
    });

module.exports = router;
