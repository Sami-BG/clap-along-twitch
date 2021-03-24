// server.js

require('dotenv').config({ path: 'variables.env' });
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const Pusher = require('pusher');
const PingInterval = 50;

const pusher = new Pusher({
    appId: process.env.PUSHER_APP_ID,
    key: process.env.PUSHER_APP_KEY,
    secret: process.env.PUSHER_APP_SECRET,
    cluster: process.env.PUSHER_APP_CLUSTER,
    encrypted: true,
});

const app = express();
app.use(cors());
app.use(bodyParser.json());

let pingAccumulator = 0;

function flushPings() {
    const time = new Date().getTime();
    pusher.trigger('poll-channel', 'update-poll', {
        'time': time,
        'frequency': pingAccumulator
    });
    pingAccumulator = 0;
}

setInterval(() => flushPings(), PingInterval);

function receivePing(req, res) {
    console.log('Ping: ' + req.body);
    // TODO: this randomization is temporary till we get hosted testing.
    pingAccumulator += Math.floor(Math.random() * 10);
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