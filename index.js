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

	this.create = (size = 300) => {
		context = createAudioContext();
		source = context.createBufferSource();
		gain = context.createGain();
		analyser = context.createAnalyser();

		source.connect(gain);
		gain.connect(analyser);
		analyser.connect(context.destination);

		array = new Uint8Array(size);
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
			});
		};
		request.send();
	};

	this.pause = () => {
		// source.disconnect();
		context.suspend();
	};

	this.resume = () => {
		context.resume();
		// const tmpBuffer = source.buffer;
		// const tmpOnended = source.onended;

		// source = context.createBufferSource();
		// source.connect(gain);
		// source.buffer = tmpBuffer;
		// source.onended = tmpOnended;

		// source.start(0, 0);
	};

	this.getDuration = () => source.buffer.duration;

	this.getCurrentTime = () => {

	};

	this.setCurrentTime = time => {

	};

	this.getVolume = () => gain.gain.value;

	this.setVolume = volume => {
		gain.gain.value = volume;
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
// webAudio.load('sample.mp3');
setTimeout(() => {
	webAudio.pause();
	setTimeout(() => {
		webAudio.resume();
	}, 1000);
}, 3000);

module.exports = WebAudio;