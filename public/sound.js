var context = new AudioContext();

var sounds = {
    'snare' : loadSoundFile('snare'),
    'hat'   : loadSoundFile('hat')
};


var analyser = context.createAnalyser();
analyser.smoothingTimeConstant = 0.3;
analyser.fftSize = 1024;
// 21 times a second
var node = context.createScriptProcessor(2048, 1, 1);
node.onaudioprocess = function getAverageSignalLevel(id) {
    // get the average, bincount is fftsize / 2
    var amplitudes =  new Uint8Array(analyser.frequencyBinCount);
    analyser.getByteFrequencyData(amplitudes);

    // sum amplitudes
    var amplitude = amplitudes.reduce(function sum(a, b) {
        return a + b;
    }, 0);
    getSoundLevel(id, Math.floor(amplitude / amplitudes.length));
}

function playSound(type, el) {
    var source = context.createBufferSource();

    source.connect(analyser);
    analyser.connect(node);
    node.connect(context.destination);
    source.connect(context.destination);

    node.onaudioprocess = function getAverageSignalLevel() {
        // get the average, bincount is fftsize / 2
        var amplitudes =  new Uint8Array(analyser.frequencyBinCount);
        analyser.getByteFrequencyData(amplitudes);

        // sum amplitudes
        var amplitude = amplitudes.reduce(function sum(a, b) {
            return a + b;
        }, 0);
        getSoundLevel(el, Math.floor(amplitude / amplitudes.length));
    }

    source.buffer = sounds[type];
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
