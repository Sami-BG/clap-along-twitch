// server.js

require('dotenv').config({ path: 'variables.env' });
const express = require('express');
const cors = require('cors');
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

function updatePoll() {
    setInterval(() => {
        increment();
        pusher.trigger('poll-channel', 'update-poll', {
            poll,
        });
    }, 1000);
}

const poll = [
    {
        name: '-4',
        votes: 100,
    },
    {
        name: '-3',
        votes: 70,
    },
    {
        name: '-2',
        votes: 250,
    },
    {
        name: '-1',
        votes: 689,
    },
    {
        name: '0',
        votes: 150,
    },
];

const app = express();
app.use(cors());

app.get('/poll', (req, res) => {
    res.json(poll);
    updatePoll();
});

app.set('port', process.env.PORT || 4000);
const server = app.listen(app.get('port'), () => {
    console.log(`Express running → PORT ${server.address().port}`);
});