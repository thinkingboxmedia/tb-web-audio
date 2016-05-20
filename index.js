function WebAudio() {
	const context = createAudioContext();
	const gain = context.createGain();
	const analyser = context.createAnalyser();
	const request = new XMLHttpRequest();
	let array = new Uint8Array(1024);
	let source = null;
	let audioStartTime = 0;
	let contextStartTime = 0;
	let volume = 1;

	gain.connect(analyser);
	analyser.connect(context.destination);

	this.load = (src, onload = null, onended = null, autoplay = true, loop = true) => {
		if(!(/(.mp3|.ogg|.wav)/i.test(src))) {
			const arr = src.split('.').reverse();
			console.error(new Error('File format \'.' + arr[0] + '\' is not supported. Unable to decode audio data.'));
			return;
		}
		destroySource();
		request.abort();
		request.open('GET', src, true);
		request.responseType = 'arraybuffer';
		request.onload = () => {
			if(request.response.byteLength === 124) {
				console.error(new Error('\'' + src + '\' is not found. Unable to decode audio data.'));
				return;
			} else {
				context.decodeAudioData(request.response, buffer => {
					if(onended != null && !isFunction(onended)) {
						console.error(new Error('Onended must be a function.'));
						onended = null;
					}
					createSource(buffer, loop, onended, 0);
					if(!autoplay) {
						this.pause();
					}
					if(isFunction(onload)) {
						onload();
					} else if(onload != null) {
						console.error(new Error('Onload must be a function.'));
					}
				});
			}
		};
		request.send();
	};

	this.play = () => {
		if(context.state == 'suspended') {
			context.resume();
		}
	};

	this.pause = () => {
		if(context.state == 'running') {
			context.suspend();
		}
	};

	this.getDuration = () => {
		if(source == null) {
			console.error(new Error('Source is not loaded yet.'));
			return;
		}
		return source.buffer.duration;
	};

	this.getCurrentTime = () => {
		if(source == null) {
			console.error(new Error('Source is not loaded yet.'));
			return;
		}
		return (audioStartTime + context.currentTime - contextStartTime) % source.buffer.duration;
	};

	this.setCurrentTime = time => {
		if(source == null) {
			console.error(new Error('Source is not loaded yet.'));
			return;
		} else if(typeof time != 'number') {
			console.error(new Error('Time must be a number.'));
			return;
		}
		if(time < 0) {
			time = 0;
		} else if(time > source.buffer.duration) {
			time = source.buffer.duration;
		}
		const tmpBuffer = source.buffer;
		const tmpLoop = source.loop;
		const tmpOnended = source.onended;
		destroySource();
		createSource(tmpBuffer, tmpLoop, tmpOnended, time);
	};

	this.mute = () => {
		gain.gain.value = 0;
	};

	this.unmute = () => {
		gain.gain.value = volume;
	};

	this.getVolume = () => gain.gain.value;

	this.setVolume = value => {
		if(typeof value != 'number') {
			console.error(new Error('Volume must be a number.'));
			return;
		}
		volume = Math.min(Math.max(0, value), 100);
		gain.gain.value = volume;
	};

	this.getFreqData = () => {
		analyser.getByteFrequencyData(array);
		return array;
	};

	this.setFreqDataLength = length => {
		if(typeof length != 'number') {
			console.error(new TypeError('Length must be a number.'));
			return;
		}
		array = new Uint8Array(Math.min(Math.max(1, length), 1024));	
	};

	function createAudioContext() {
		let ctx = new (window.AudioContext || window.webkitAudioContext)();
		if(ctx.sampleRate != 44100) {
			if(ctx.close) {
				ctx.close();
			}
			ctx = new (window.AudioContext || window.webkitAudioContext)();
		}
		return ctx;
	}

	function createSource(buffer, loop, onended, time) {
		source = context.createBufferSource();
		source.connect(gain);
		source.buffer = buffer;
		source.loop = loop;
		source.onended = onended;
		source.start(0, time);
		audioStartTime = time;
		contextStartTime = context.currentTime;
	}

	function destroySource() {
		if(source) {
			source.disconnect();
			source.onended = null;
		}
	}

	function isFunction(fn) {
		const getType = {};
		return (fn && getType.toString.call(fn) === '[object Function]');
	}
}
module.exports = WebAudio;