function WebAudio() {
	let context, source, gain, analyser, array, audioStartTime, contextStartTime;

	const createAudioContext = () => {
		let ctx = new (window.AudioContext || window.webkitAudioContext)();
		if(ctx.sampleRate != 44100) {
			if(ctx.close) {
				ctx.close();
			}
			ctx = new (window.AudioContext || window.webkitAudioContext)();
		}		
		return ctx;
	};

	const disconnectSource = () => {
		source.disconnect();
		source.onended = null;
	};

	this.create = (size = 300) => {
		context = createAudioContext();
		gain = context.createGain();
		analyser = context.createAnalyser();

		gain.connect(analyser);
		analyser.connect(context.destination);

		array = new Uint8Array(size);
	};

	this.load = (src, onended = null) => {
		if(source) {
			disconnectSource();
		}
		const request = new XMLHttpRequest();
		request.open('GET', src, true);
		request.responseType = 'arraybuffer';
		request.onload = () => {
			context.decodeAudioData(request.response, buffer => {
				source = context.createBufferSource();
				source.connect(gain);
				source.buffer = buffer;
				source.onended = onended;
				source.start(0, 0);
				audioStartTime = 0;
				contextStartTime = context.currentTime;
			});
		};
		request.send();
	};

	this.pause = () => {
		context.suspend();
	};

	this.resume = () => {
		context.resume();
	};

	this.getDuration = () => source.buffer.duration;

	this.getTime = () => audioStartTime + context.currentTime - contextStartTime;

	this.setTime = time => {		
		const tmpBuffer = source.buffer;
		const tmpOnended = source.onended;
		disconnectSource();

		source = context.createBufferSource();
		source.connect(gain);
		source.buffer = tmpBuffer;
		source.onended = tmpOnended;
		source.start(0, time);
		
		audioStartTime = time;
		contextStartTime = context.currentTime;
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

module.exports = WebAudio;