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

const PORT = process.env.PORT || 3000;

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

http.listen(PORT, () => {
    console.log(`Server listening at port ${PORT}`);
});
