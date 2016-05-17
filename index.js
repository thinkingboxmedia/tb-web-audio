function createAudioContext() {

	let context = new (window.AudioContext || window.webkitAudioContext)();

	if(context.sampleRate != 44100) {
		if(context.close) {
			context.close();
		}
		context = new (window.AudioContext || window.webkitAudioContext)();
	}
		
	return context;
}

function WebAudio() {
	let context, source, gain, analyser, array;
	let time;

	this.create = (size = 300) => {
		context = createAudioContext();
		source = context.createBufferSource();
		gain = context.createGain();
		analyser = context.createAnalyser();

		source.connect(gain);
		gain.connect(analyser);
		analyser.connect(context.destination);

		array = new Uint8Array(size);

		console.log('created');
	};

	this.load = (src, onended = null) => {
		const request = new XMLHttpRequest();
		request.open('GET', src, true);
		request.responseType = 'arraybuffer';
		request.onload = () => {
			context.decodeAudioData(request.response, buffer => {
				source.buffer = buffer;
				source.onended = onended;
				source.start(0, 0);
				console.log('loaded');
			});
		};
		request.send();
	};

	this.pause = () => {
		source.disconnect();
		source.onended = null;
		console.log(source.buffer);
	};

	this.resume = () => {
		// const tmpBuffer = source.buffer;
		// source.
	};

	this.seek = value => {
		if(value.indexOf('%') > -1) {

		} else {

		}
	};

	this.setVolume = value => {
		gain.gain.value = value;
	};

	this.getFreqData = () => {
		analyser.getByteFrequencyData(array);
		return array;
	};

	this.destroy = () => {
		if(context.close) {
			context.close();
		}
		context = null;
	};
}

let webAudio = new WebAudio();
webAudio.create();

module.exports = WebAudio;


/*

Audio.create() = create context, source, gain and analyser

Audio.load(src) = set source

Audio.pause() = pause

Audio.resume() = resume

Audio.seek(time/percentage) = create source with same buffer, start from time/percentage

Audio.setVolume(int) = set gain

Audio.getFreqData() = return dataArray 

Audio.destroy() = disconnect everything and delete context

*/