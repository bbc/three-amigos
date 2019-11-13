

var express = require('express');
var app = express();
var storyModel = require('./storyModel.json')
const cors = require('cors')
var number = 0;
const { handleEmotion } = require('./emotion');
app.use(cors());
app.use(express.static(__dirname + '/www'));

app.listen('3000');
console.log('working on 3000');

const emotions = {
    'neutral': 0,
    'sad': 0,
    'angry': 0,
    'happy': 0
}

app.get('/getStory', function (req, res) {
    
    res.send(storyModel[number]);
    number = number+1;
})

app.get('/nextStory', function (req, res) {
    
    res.send(`hello`);
})

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
