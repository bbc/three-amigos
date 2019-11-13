var final_transcript = '';
var recognizing = false;
// const emotions = ['sleep', 'thanks', 'hug', 'blush']
const storyModel = require('storyModel.json');
  
if ('webkitSpeechRecognition' in window) {

var recognition = new webkitSpeechRecognition();

recognition.continuous = true;
recognition.interimResults = true;

recognition.onstart = function() {
    recognizing = true;
    console.log(storyModel);
};

recognition.onerror = function(event) {
    console.log(event.error);
};

recognition.onend = function() {
    recognizing = false;
};

recognition.onresult = function(event) {
    var interim_transcript = '';
    for (var i = event.resultIndex; i < event.results.length; ++i) {
        if (event.results[i].isFinal) {
            final_transcript += event.results[i][0].transcript;
        } else {
            interim_transcript += event.results[i][0].transcript;
        }
    }
    // matchEmotion(final_transcript);
    // final_transcript = capitalize(final_transcript);


    // user input available in final_transcript
    final_span.innerHTML = linebreak(final_transcript);
    interim_span.innerHTML = linebreak(interim_transcript);
    };
}

var two_line = /\n\n/g;
var one_line = /\n/g;

// function matchEmotion(s) {
//     s.split(' ').forEach(word => {
//         console.log(`word=${word}`);
//         // if (emotions.includes(word)) {
//         console.log(`emotionMapping=${JSON.stringify(emotionMapping)}`);
//         if (word in emotionMapping) {
//             console.log(`${word in emotionMapping}`)
//             // console.log(`${word} in emotions`)
//             // setEmoticon(word);
//         } else {
//             Object.values(emotionMapping).map(({ words }) => {
//                 const image = words.filter(e => e === word).map(e => e.image);
//                 console.log(image)
//             })
//         }
//     })
// }

// function setEmoticon (emotion) {
//     const avatar = document.getElementById('avatar');
//     avatar.src = `assets/emoticon/bunny_${emotion}.gif`;
//     return;
// }

function linebreak(s) {
    return s.replace(two_line, '<p></p>').replace(one_line, '<br>');
}

function capitalize(s) {
    return s.replace(s.substr(0,1), function(m) { return m.toUpperCase(); });
}

function startDictation(event) {
    if (recognizing) {
        recognition.stop();
        return;
    }
    final_transcript = '';
    recognition.lang = 'en-GB';
    recognition.start();
    final_span.innerHTML = '';
    interim_span.innerHTML = '';
}