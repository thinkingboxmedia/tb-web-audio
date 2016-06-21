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
	let isEnded = false;

	gain.connect(analyser);
	analyser.connect(context.destination);

	this.load = (src, onload = null, onended = null, autoplay = true, loop = true) => {
		if(!(/\.(mp3|ogg|wav)$/i.test(src))) {
			const arr = src.split('.').reverse();
			console.error(new Error('File format \'.' + arr[0] + '\' is not supported. Unable to decode audio data.'));
			return;
		}

		this.pause();
		request.abort();
		request.open('GET', src, true);
		request.responseType = 'arraybuffer';
		request.onload = () => {
			if(request.response.byteLength == 124) {
				console.error(new Error('\'' + src + '\' is not found. Unable to decode audio data.'));
				return;
			} else {
				context.decodeAudioData(request.response, buffer => {
					if(onended != null && !isFunction(onended)) {
						console.error(new TypeError('Onended must be a function.'));
						onended = null;
					}
					destroySource();
					createSource(buffer, loop, onended, 0);
					if(autoplay) {
						this.play();
					} else {
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

	this.isPlaying = () => context.state == 'running';

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
		if(isEnded) {
			return source.buffer.duration;	
		}
		return (audioStartTime + context.currentTime - contextStartTime) % source.buffer.duration;
	};

	this.setCurrentTime = time => {
		if(source == null) {
			console.error(new Error('Source is not loaded yet.'));
			return;
		} else if(typeof time != 'number') {
			console.error(new TypeError('Time must be a number.'));
			return;
		}
		if(time < 0) {
			time = 0;
		} else if(time > source.buffer.duration) {
			time = source.buffer.duration;
		}
		var tmpBuffer = source.buffer;
		var tmpLoop = source.loop;
		var tmpOnended = source.onended;
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
			console.error(new TypeError('Volume must be a number.'));
			return;
		} else if (value < 0 || value > 100) {
			console.error(new Error('Volume must be between 0 and 100.'));
			return;
		}
		volume = value;
		gain.gain.value = roundToDec(volume, 2);
	};

	this.fadeIn = time => {
		if(typeof time != 'number') {
			console.error(new TypeError('Volume must be a number.'));
			return;
		}
		this.play();
		gain.gain.value = 0;
		var stepVolume = volume / time * 100;
		var fadeInInterval = setInterval(() => {
			gain.gain.value = roundToDec(gain.gain.value + stepVolume, 2);
			if(gain.gain.value >= volume) {
				gain.gain.value = volume;
				clearInterval(fadeInInterval);
			}
		}, 100);
	};

	this.fadeOut = (time, pause = true) => {
		if(typeof time != 'number') {
			console.error(new TypeError('Volume must be a number.'));
			return;
		}
		var stepVolume = gain.gain.value / time * 100;
		var fadeOutInterval = setInterval(() => {
			gain.gain.value = roundToDec(gain.gain.value - stepVolume, 2);
			if(gain.gain.value <= 0) {
				gain.gain.value = 0;
				clearInterval(fadeOutInterval);
				if(pause === true) {
					this.pause();
				}
			}
		}, 100);
	};

	this.getFreqData = () => {
		analyser.getByteFrequencyData(array);
		return array;
	};

	this.setFreqDataLength = length => {
		if(typeof length != 'number') {
			console.error(new TypeError('Length must be a number.'));
			return;
		} else if (length < 1 || length > 1024) {
			console.error(new Error('Length must be between 1 and 1024.'));
			return;
		}
		array = new Uint8Array(length);	
	};

	function createAudioContext() {
		var ctx = new (window.AudioContext || window.webkitAudioContext)();
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
		source.onended = () => {
			isEnded = true;
			if(onended) {
				onended();	
			}
		};
		source.start(0, time);
		isEnded = false;
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
		var getType = {};
		return (fn && getType.toString.call(fn) == '[object Function]');
	}

	function roundToDec(number, dec) {
		return Math.round(number * Math.pow(10, dec)) / Math.pow(10, dec);
	}

	isValid(e, type) {
		return {}.toString.call(e).toLowerCase().indexOf(type) > -1;
	}

	throwTypeError(e, type) {
		console.error(new TypeError('Type of ' + e + ' must be ' + type + '.'));
	}
}

module.exports = WebAudio;