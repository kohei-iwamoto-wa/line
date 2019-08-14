'use strict';

const line = require('@line/bot-sdk');
const express = require('express');
const schedule = require('./models/schedule.js');

// load environment variables
require('dotenv').config(); 

// LINE Bot Setting
const config = {
    channelAccessToken: process.env.CHANNEL_ACCESS_TOKEN,
    channelSecret: process.env.CHANNEL_SECRET
};

const client = new line.Client(config);

// base URL for webhook server
const baseURL = process.env.BASE_URL;

// express
const app = new express();
const port = 3000;

// serve static files
// app.use('/static', express.static('static'));

// constants
const SCHEDULE_START_MESSAGE = '登録';
const SCHEDULE_SHOW_MESSAGE = '確認';
const SCHEDULE_DELETE_MESSAGE = '削除';

// root
app.get('/', (req, res) => {
    console.log('Root Accessed!');
    // Let's QUIZ!   
    res.send('This is a LINE Bot hands-on quiz app!');
});

// LINE Bot webhook callback [POST only]
app.post('/schedule', line.middleware(config), (req, res) => {
    console.log('LINE Bot webhook callback handle function called!');
    if (req.body.destination) {
        console.log("Destination User ID: " + req.body.destination);
    }
    // req.body.events should be an array of events
    if (!Array.isArray(req.body.events)) {
        return res.status(500).end();
    }
    // handle each event
    Promise
        .all(req.body.events.map(handleEvent))
        .then(() => res.end())
        .catch((err) => {
            console.error(err);
            res.status(500).end();
        });
});

// callback function to handle a single event
function handleEvent(event) {
    if (event.replyToken && event.replyToken.match(/^(.)\1*$/)) {
        return console.log("Test hook recieved: " + JSON.stringify(event.message));
    }
    // handle event
    switch (event.type) {
        // handle message event
        case 'message':
            const message = event.message;
            switch (message.type) {
                // handle Text message
                case 'text':
                return (handleText(message, event.replyToken, event.source),
                    schedule.scheduleRegist(message));
                // unknown message
                default:
                    replyText(replyToken, 'よく分かりませんでした');
            }
        // unknown event
        default:
            throw new Error(`Unknown event: ${JSON.stringify(event)}`);
    }
};

function handleText(message, replyToken, event_source) {
    console.log('handleText function called!');
    const message_text = message.text;
    console.log('message text: ' + message_text);

    if (message_text === SCHEDULE_START_MESSAGE) {
        console.log('スケジュール入力');
        return replyText(replyToken, 'スケジュールを入力してください');

    } else if (message_text === SCHEDULE_SHOW_MESSAGE) {
        console.log('スケジュール確認');
        //  schedule.scheduleConfirm();
        console.log(schedule)
       return replyText(replyToken, 'スケージュールだよ');

    } else if (message_text === SCHEDULE_DELETE_MESSAGE) {
        console.log('スケジュール削除');
        return replyText(replyToken, 'スケジュール削除したよ');
    }
};
 
// simple reply function
function replyText (token, texts) {
    texts = Array.isArray(texts) ? texts : [texts];
    return client.replyMessage(
        token,
        texts.map((text) => ({ type: 'text', text }))
    );
};

// run express server
app.listen(port, () => {
    console.log(`Server running on ${port}`)
});
