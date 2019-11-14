var recognizing = false;
// const emotions = ['sleep', 'thanks', 'hug', 'blush']
let story = {};
let number = 0;
let audio;

if ('webkitSpeechRecognition' in window) {

var recognition = new webkitSpeechRecognition();

recognition.continuous = true;
recognition.interimResults = true;

recognition.onstart = function() {
    recognizing = true;
};

recognition.onerror = function(event) {
    console.log(event.error);
};

recognition.onend = function() {
    recognizing = false;
};

recognition.onresult = function(event) {
    var interim_transcript = '';
    var final_transcript = '';
    for (var i = event.resultIndex; i < event.results.length; ++i) {
        if (event.results[i].isFinal) {
            final_transcript += event.results[i][0].transcript;
        } else {
            interim_transcript += event.results[i][0].transcript;
        }
    }

    if (final_transcript) {
        handleUserInput(final_transcript);
    }
    
    final_transcript = capitalize(final_transcript);
    final_span.innerHTML = linebreak(final_transcript);
    interim_span.innerHTML = linebreak(interim_transcript);
    };
}

var two_line = /\n\n/g;
var one_line = /\n/g;

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

async function handleUserInput(userInput) {
    userInput = userInput.toLowerCase();
    console.log(`userInput=${userInput}`);
    // setEmoticon('neutral');
    const prefix = 'https://three-amigos-assets.s3-eu-west-1.amazonaws.com/'
    if (userInput.split(' ').includes('news') || userInput.split(' ').includes('headlines')) {
        story = await callGetStory(userInput, number, 'getStory');
        storyText.innerHTML = story.headline;
        audio = new Audio(`${prefix}headline_${story.index}.wav`);
        audio.play();
    }
    else if (userInput === 'not interested') {
        //story = await callGetStory(userInput, number,  'getStory');
        storyText.innerHTML = story.condensed;
        audio = new Audio(`${prefix}condensed_${story.index}.wav`);
        audio.play();
    } else if (userInput == 'interested' || userInput.split(' ').includes('interesting')) {
        // setTimeout(() => setEmoticon('hi5', false), 2000);
        // story = await callGetStory(userInput, number, 'getStory');
        storyText.innerHTML = story.long.join('\n');
        let line = 0;
        audio = new Audio(`${prefix}long_${story.index}_${line}.wav`);
        audio.play();
        //number += 1
        audio.addEventListener('ended', async () => {
            if (line < story.long.length) {
                audio.src = `${prefix}long_${story.index}_${line}.wav`;
                audio.play();
                line += 1;
            }
            // } else {
            //     const emotions = await callGetEmotions();
            //     console.log(`emotions=${JSON.stringify(emotions)}`);
            //     topEmotion = Object.keys(emotions).reduce((result, emotion) => {
                  
            //         console.log(result)
            //         console.log(emotion)
            //         return emotions[emotion] > emotions[result] ? emotion : result
                        
            //     })
            // }
        });
    } else if (userInput == 'hi' || userInput == 'hello' || userInput == 'hey') {
        story = await callGetStory(userInput, number, 'nextStory');
        storyText.innerHTML = story.headline;
        setEmoticon(storyModel[story.index].image, true);
        audio = new Audio(`${prefix}headline_${story.index}.wav`);
        audio.play();
        number += 1

    } else if(hasQuestion(userInput)){
        var question = getBestQuestion(userInput);
        storyText.innerHTML = question.answer;
        audio = new Audio(`${prefix}answer_${story.index}_${question.index}.wav`);
        audio.play();

    } else {
        story = await callGetStory(userInput, number, 'nextStory');
        // number += 1

        console.log(story);
        storyText.innerHTML = story.headline;
        setEmoticon(storyModel[story.index].image, true);
        audio = new Audio(`${prefix}headline_${story.index}.wav`);
        audio.play();
        number = number < 2 ? number + 1 : 0;
    } 
}

function hasQuestion(userInput){
    var returnvalue = false
    story.questions.forEach(element => {
        element.keywords.filter(word => {
            var array = userInput.split(' ');
            if(array.includes(word)){
                returnvalue = true;
            }
        })
    })
    return returnvalue;
}

function getBestQuestion(userInput){
    var question = {}
    var noMatches = 0;
    story.questions.forEach(element => {
        eachNoMatches = 0;
        element.keywords.filter(word => {
            var array = userInput.split(' ');
            if(array.includes(word)){
                eachNoMatches +=1;
            }
        })
        if(eachNoMatches > noMatches){
            question = element;
            noMatches = eachNoMatches
        }
    })
    return question;
}

function setEmoticon (emotion, image) {
    const avatar = document.getElementById('avatar');
    avatar.src = image ? emotion : `assets/emoticon/bunny_${emotion}.gif`;
    return;
}

function interested() {
    storyText.innerHTML = story.long;
    audio = new Audio(`${prefix}long_${story.index}.wav`);
    audio.play();
}

function notInterested() {
    storyText.innerHTML = story.condensed;
    audio = new Audio(`${prefix}condensed_${story.index}.wav`);
    audio.play();
}

function stopAudio() {
    audio.pause();
}

async function callGetStory(userInput, number, resource) {
    return fetch(`http://localhost:3000/${resource}`, {
      method: 'post',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ userInput, number })
    })
    .then(response => {
        console.log(JSON.stringify(response))
        return response.json()
    })
    .then(result => {
        console.log(result)
        return result
    });
}

async function callGetEmotions() {
    return fetch(`http://localhost:3000/getEmotions`, {
      method: 'get',
      headers: {
        'Content-Type': 'application/json'
      }
    })
    .then(response => {
        console.log(JSON.stringify(response))
        return response.json()
    })
    .then(result => {
        console.log(result)
        return result
    });
}