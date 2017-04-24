var context;
try {
    // Fix up for prefixing
    window.AudioContext = window.AudioContext||window.webkitAudioContext;
    context = new AudioContext();
}
catch(e) {
    alert('Web Audio API is not supported in this browser');
}

var source = null;
var audioBuffer = null;

function playSound() {
     source = context.createBufferSource();
    source.buffer = audioBuffer;
    source.loop = false;
    source.connect(context.destination);
    source.start(0);
}

function initSound(arrayBuffer) {
    context.decodeAudioData(arrayBuffer, function(buffer) {
        // audioBuffer is global to reuse the decoded audio later.
        audioBuffer = buffer;
    }, function(e) {
        console.log('Error decoding file', e);
    });
}

// Load file from a URL as an ArrayBuffer.
// Example: loading via xhr2: loadSoundFile('sounds/test.mp3');
loadSoundFile('sounds/snare.mp3');
function loadSoundFile(url) {
    var xhr = new XMLHttpRequest();
    xhr.open('GET', url, true);
    xhr.responseType = 'arraybuffer';
    xhr.onload = function(e) {
        initSound(this.response); // this.response is an ArrayBuffer.
    };
    xhr.send();
}
