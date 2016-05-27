import WebAudio from '../src/index';

let interval;
const webAudio = new WebAudio();
webAudio.setFreqDataLength(10);

document.getElementById('load').onclick = () => {
	webAudio.load('sample.mp3', () => {
		document.getElementById('status').innerHTML = 'status: audio loaded';
	}, () => {
		document.getElementById('status').innerHTML = 'status: audio ended';
	}, false, false);
};

document.getElementById('play').onclick = () => {
	webAudio.play();
	clearInterval(interval);
	interval = setInterval(() => {
		document.getElementById('volume').innerHTML = 'volume: ' + webAudio.getVolume();
		document.getElementById('data').innerHTML = 'freqData: ' + arrayToString(webAudio.getFreqData());
		document.getElementById('time').innerHTML = 'currentTime: ' + webAudio.getCurrentTime();
	}, 100);
	document.getElementById('status').innerHTML = 'status: audio playing';
};

document.getElementById('pause').onclick = () => {
	webAudio.pause();
	clearInterval(interval);
	document.getElementById('status').innerHTML = 'status: audio paused';
};

document.getElementById('mute').onclick = () => {
	if(webAudio.getVolume() == 0) {
		webAudio.unmute();
	} else {
		webAudio.mute();
	}
};

document.getElementById('fadein').onclick = () => {
	webAudio.fadeIn(1000);
	clearInterval(interval);
	interval = setInterval(() => {
		document.getElementById('volume').innerHTML = 'volume: ' + webAudio.getVolume();
		document.getElementById('data').innerHTML = 'freqData: ' + arrayToString(webAudio.getFreqData());
		document.getElementById('time').innerHTML = 'currentTime: ' + webAudio.getCurrentTime();
	}, 100);
};

document.getElementById('fadeout').onclick = () => {
	webAudio.fadeOut(1000, false);
};

document.getElementById('setVol').onclick = () => {
	webAudio.setVolume(2);
};

document.getElementById('setTime').onclick = () => {
	webAudio.setCurrentTime(10);
};

function arrayToString(array) {
	let string = '';
	for(let i=0; i<array.length; i++) {
		string += ', ' + array[i];
	}
	return string.slice(2);
}