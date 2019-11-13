

var express = require('express');
var app = express();
var storyModel = require('./storyModel.json')
const cors = require('cors')
var number = 0;

app.use(cors());
app.use(express.static(__dirname + '/www'));

app.listen('3000');
console.log('working on 3000');

app.get('/getStory', function (req, res) {
    
    res.send(storyModel[number]);
    number = number+1;
})

app.get('/nextStory', function (req, res) {
    
    res.send(`hello`);
})
