// server.js

require('dotenv').config({ path: 'variables.env' });
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const Pusher = require('pusher');

const pusher = new Pusher({
    appId: process.env.PUSHER_APP_ID,
    key: process.env.PUSHER_APP_KEY,
    secret: process.env.PUSHER_APP_SECRET,
    cluster: process.env.PUSHER_APP_CLUSTER,
    encrypted: true,
});

function getRandomNumber(min, max) {
    return Math.floor(Math.random() * (max - min) + min);
}

function increment() {
    const num = getRandomNumber(0, poll.length);
    poll[num].votes += 20;
}

const poll = [
    {
        name: '0',
        votes: 0,
    },
    {
        name: '1',
        votes: 0,
    },
    {
        name: '2',
        votes: 0,
    },
    {
        name: '3',
        votes: 0,
    },
    {
        name: '4',
        votes: 0,
    },
];

const app = express();
app.use(cors());
app.use(bodyParser.json());

app.get('/poll', (req, res) => {
    res.json(poll);
    updatePoll();
    console.log('app.get poll, req:' + req +' res: ' + res);
});

function ping(time) {
    var modulo_seconds = time % 5;
    poll[modulo_seconds].votes += 1;
    pusher.trigger('poll-channel', 'update-poll', {
        poll,
    });
}

function receivePing(req, res) {
    console.log('Ping: ' + req.body);
    var time = new Date(req.body['time']);
    ping(time);
}

app.post('/ping', (req, res) => {
    console.log('pinged');
    res.send('Hello from res' + res);
    receivePing(req, res);
});

app.set('port', process.env.PORT || 4000);
const server = app.listen(app.get('port'), () => {
    console.log(`Express running → PORT ${server.address().port}`);
});