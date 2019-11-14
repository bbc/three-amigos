

const express = require('express');
const app = express();
const storyModel = require('./storyModel.json');
const cors = require('cors')
const bodyParser = require('body-parser')

app.use(cors());
app.use(express.static(__dirname + '/www'));
app.use(bodyParser.json())

app.listen('3000');
console.log('working on 3000');

const emotions = {
    'neutral': 0,
    'sad': 0,
    'angry': 0,
    'happy': 0
}

app.post('/nextStory', (req, res) => {
    console.log(`nextStory`);
    const { number } = req.body;
    res.send(storyModel[number]);
});

app.post('/getStory', (req, res) => {
    console.log(`getStory`);
    const { number } = req.body;
    res.send(storyModel[number]);
});

app.get('/emotion/:emotion', (req, res) => {
    const { emotion } = req.params;
    console.log(`emotion=${emotion}`);
    emotions[emotion] += 1;
    console.log(`emotions=${JSON.stringify(emotions)}`);
    res.send(200)
});

app.get('/getEmotions', (req, res) => {
    res.send(emotions);
    Object.keys(emotions).forEach(emotion => emotions[emotion] = 0)
})
