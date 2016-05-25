function WebAudio() {
	var context = createAudioContext();
	var gain = context.createGain();
	var analyser = context.createAnalyser();
	var request = new XMLHttpRequest();
	var array = new Uint8Array(1024);
	var source = null;
	var audioStartTime = 0;
	var contextStartTime = 0;
	var volume = 1;
	var isEnded = false;

	gain.connect(analyser);
	analyser.connect(context.destination);

	this.load = function(src, onload, onended, autoplay, loop) {
		if(!(/(.mp3|.ogg|.wav)/i.test(src))) {
			var arr = src.split('.').reverse();
			console.error(new Error('File format \'.' + arr[0] + '\' is not supported. Unable to decode audio data.'));
			return;
		}

		onload = onload || null;
		onended = onended || null;
		autoplay = (autoplay === undefined) ? true : autoplay;
		loop = (loop === undefined) ? true : loop;

		this.pause();
		request.abort();
		request.open('GET', src, true);
		request.responseType = 'arraybuffer';
		request.onload = function() {
			if(request.response.byteLength == 124) {
				console.error(new Error('\'' + src + '\' is not found. Unable to decode audio data.'));
				return;
			} else {
				context.decodeAudioData(request.response, function(buffer) {
					if(onended != null && !isFunction(onended)) {
						console.error(new Error('Onended must be a function.'));
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
				}.bind(this));
			}
		}.bind(this);
		request.send();
	};

	this.play = function() {
		if(context.state == 'suspended') {
			context.resume();
		}
	};

	this.pause = function() {
		if(context.state == 'running') {
			context.suspend();
		}
	};

	this.isPlaying = function() {
		return (context.state == 'running');
	};

	this.getDuration = function() {
		if(source == null) {
			console.error(new Error('Source is not loaded yet.'));
			return;
		}
		return source.buffer.duration;
	};

	this.getCurrentTime = function() {
		if(source == null) {
			console.error(new Error('Source is not loaded yet.'));
			return;
		}
		if(isEnded) {
			return source.buffer.duration;	
		}
		return (audioStartTime + context.currentTime - contextStartTime) % source.buffer.duration;
	};

	this.setCurrentTime = function(time) {
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
		var tmpBuffer = source.buffer;
		var tmpLoop = source.loop;
		var tmpOnended = source.onended;
		destroySource();
		createSource(tmpBuffer, tmpLoop, tmpOnended, time);
	};

	this.mute = function() {
		gain.gain.value = 0;
	};

	this.unmute = function() {
		gain.gain.value = volume;
	};

	this.getVolume = function() {
		return gain.gain.value;
	};

	this.setVolume = function(value) {
		if(typeof value != 'number') {
			console.error(new Error('Volume must be a number.'));
			return;
		}
		volume = Math.min(Math.max(0, value), 100);
		gain.gain.value = roundToDec(volume, 2);
	};

	this.fadeIn = function(time) {
		this.play();
		gain.gain.value = 0;
		var stepVolume = volume / time * 100;
		var fadeInInterval = setInterval(function() {
			gain.gain.value = roundToDec(gain.gain.value + stepVolume, 2);
			if(gain.gain.value >= volume) {
				gain.gain.value = volume;
				clearInterval(fadeInInterval);
			}
		}, 100);
	};

	this.fadeOut = function(time, pause) {
		pause = (pause === undefined) ? true : pause;
		var stepVolume = gain.gain.value / time * 100;
		var fadeOutInterval = setInterval(function() {
			gain.gain.value = roundToDec(gain.gain.value - stepVolume, 2);
			if(gain.gain.value <= 0) {
				gain.gain.value = 0;
				clearInterval(fadeOutInterval);
				if(pause) {
					this.pause();
				}
			}
		}.bind(this), 100);
	};

	this.getFreqData = function() {
		analyser.getByteFrequencyData(array);
		return array;
	};

	this.setFreqDataLength = function(length) {
		if(typeof length != 'number') {
			console.error(new TypeError('Length must be a number.'));
			return;
		}
		array = new Uint8Array(Math.min(Math.max(1, length), 1024));	
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
		source.onended = function() {
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
}
module.exports = WebAudio;