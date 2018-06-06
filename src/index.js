const express = require('express');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const config = require('./config/config');
const constants = require('./config/constants');
const cors = require('cors');
const roomsRouter = require('./rooms-router');

const PATHS = {
    static: __dirname + '/static'
};

const port = 1234;

app.use(cors());

app.use((req, res, next)=>{
    req.io = io;
    next();
});

app.use('/', express.static(PATHS.static));

app.use('/rooms', roomsRouter);

app.get('/config', (req, res) => {
    res.send(JSON.stringify(config));
});

app.get('/constants', (req, res) => {
    res.send(JSON.stringify(constants));
});

http.listen(port, () => {
    console.log(`Server listening at port ${port}`);
});
