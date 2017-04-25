var context = new AudioContext();

var sounds = {
    'snare' : loadSoundFile('snare'),
    'hat'   : loadSoundFile('hat')
};

function playSound(type) {
    var source = context.createBufferSource();
    source.buffer = sounds[type];
    source.connect(context.destination);
    source.start(0);
}

function loadSoundFile(type) {
    var xhr = new XMLHttpRequest();
    var url = 'sound/' + type + '.mp3';
    xhr.open('GET', url, true);
    xhr.responseType = 'arraybuffer';
    xhr.onload = function(e) {
        context.decodeAudioData(this.response, function (buffer) {
            sounds[type] = buffer;
        });
    };
    xhr.send();
}
