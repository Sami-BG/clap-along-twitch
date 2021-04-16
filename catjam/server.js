// server.js

require('dotenv').config({ path: 'variables.env' });
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const Pusher = require('pusher');
const fetch = require('node-fetch');
const request = require('request');
const PingInterval = 5000;
let clientID = process.env.TWITCH_CLIENT_ID;
let clientSecret = process.env.TWITCH_CLIENT_SECRET
let channelId = 0;
let userId = 0;
let streamStartTime = new Date() - 5000;

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
let mapOfTimeToPing = {
    streamStartDate: streamStartTime
}

// Resets the ping every couple seconds
function flushPings() {
    pusher.trigger('poll-channel', 'update-poll', mapOfTimeToPing);
    pingAccumulator = 0;
}

setInterval(() => flushPings(), PingInterval);

function updatePingBucket(delayedTime) {
    if (mapOfTimeToPing[delayedTime] == undefined) {
        mapOfTimeToPing[delayedTime] = 1;
    } else {
        mapOfTimeToPing[delayedTime] = mapOfTimeToPing[delayedTime] + 1;
    }
}


function getStreamStartTime(url, token, userId, callback) {
    const options = {
        url: url + '?user_login=' + 'logigo',
        method: 'GET',
        headers: {
            'Client-ID': clientID,
            'Authorization': 'Bearer ' + token
        }
    }

    const response = request.get(options, (err, res, body) => {
        if (err) {
            return console.log(err);
        }
        console.log('Status: ' + res.statusCode);
        console.log(JSON.parse(body));
        callback(res);
    })

}

function getOauthKey(url, callback) {
    const options = {
        url: 'https://id.twitch.tv/oauth2/token',
        json:true,
        body: {
            client_id: clientID,
            client_secret: clientSecret,
            grant_type: 'client_credentials'
        }
    };

    request.post(options, (err,res,body)=>{
        if(err){
            return console.log(err);
        }
        console.log('Status: ' + res.statusCode);
        console.log(body.access_token);
        callback(res);
    });

}


function receivePing(req, res, streamStartDate) {
    // Get time - delay

    // Multiply time difference in seconds by 1000 to get it  to milliseconds and convert it to valid date
    let delayedDate = new Date(1000 * (req.body['time'] - req.body['delay']));
    // Subtract both dates and divide by 1000 to get them back into seconds.
    let normalizedDate = (delayedDate - streamStartDate) / 1000;
    userId = req.body['user_id'];
    channelId = req.body['channel_id'];
    // Round to nearest second.
    normalizedDate = Math.floor(normalizedDate);
    // Update corresponding ping bucket
    updatePingBucket(normalizedDate);
    console.log('Normalized date: ' + normalizedDate);
    let returnPacket = {
        normalizedDate: mapOfTimeToPing[normalizedDate]
    };
    // Send back corresponding pings
    res.send(returnPacket);
}

function firstPingSubroutine(req, res, callback) {
    // Get auth key
    if (firstPing === 0) {
        getOauthKey('https://id.twitch.tv/oauth2/token', (res2) => {
            accessToken = res2.body.access_token;
            getStreamStartTime('https://api.twitch.tv/helix/streams', accessToken, userId, (res3) => {
                let streamStartTimeString = JSON.parse(res3.body)['data'][0].started_at;
                streamStartTime = new Date(streamStartTimeString);
                callback(req, res, streamStartTime);
            });
            return accessToken;
        });
    } else {
        callback(req, res, streamStartTime);
        firstPing = 1;
    }
}

let firstPing = 0;
let accessToken = '';

app.post('/ping', (req, res) => {
    console.log('Pinged.');
    firstPingSubroutine(req, res, (req, res, streamStartTime) => {
        receivePing(req, res, streamStartTime);
    })
});

app.set('port', process.env.PORT || 4000);
const server = app.listen(app.get('port'), () => {
    console.log(`Express running → PORT ${server.address().port}`);
});
// U72926898 - my user id | nqnjhxxt32v3wlapftn4cw3g9t4ntq - access token