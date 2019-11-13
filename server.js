

var express = require('express');
var app = express();
var currentStory = 0;
var storyModel = require('./storyModel.json')
app.use(express.static(__dirname + '/www'));

app.listen('3000');
console.log('working on 3000');

// respond with "hello world" when a GET request is made to the homepage
app.get('/getStory', function (req, res) {
    
    res.send(`hello ${storyModel[0].toString}`);
})
