# tb-web-audio

[![experimental](http://badges.github.io/stability-badges/dist/experimental.svg)](http://github.com/badges/stability-badges)

Simplified Web Audio API with cross-browser support. In any web project, this module is optimized for:
* Custom sound track
* Custom audio player
* Audio visualization

### Browser Support
As of May 2016, the module has been tested with the following devices and browsers:
* Desktop
    * Chrome 50.0
    * Safari 9.1
    * Firefox 46.0
* Android 6.0
    * Default Android Browser    
    * Chrome 50.0
* iOS 9.1, 9.3
    * Default iOS Safari
    * Chrome 50.0

For overall support, please refer to [Web Audio API](http://caniuse.com/#feat=audio-api).

### Install
This module is used with Browserify or Webpack.
```sh
npm install tb-web-audio
```

### Example
```js
import WebAudio from 'tb-web-audio';

const webAudio = new WebAudio();
webAudio.load('sample.mp3', () => {
    console.log('audio loaded');
}, () => {
    console.log('audio ended');
}, true, false);
```
For more detailed example, please refer to [example.js](example.js).

## Methods

### load(src, [onload, onended, autoplay, loop])
Loads audio file. Only one audio file is loaded at once - if `load` is called twice, the only the second file will be loaded.
* `src` (string) - relative/absolute path to the audio source.
* `onload` (function, optional) - callback function after audio source is loaded. Default is `null`.
* `onended` (function, optional) - callback function after audio source has ended playing. Default is `null`.
* `autoplay` (boolean, optional) - option for audio to be auto-played after loading. Default is `true`.
* `loop` (boolean, optional) - option for audio to be continuously looped. Default is `true`.

### play()
Plays the loaded file. If the file is already playing, no action is taken.

### pause()
Pauses the loaded file. If the file is already paused, no action is taken.

### getDuration()
Returns total duration of the loaded file in seconds.

### getCurrentTime()
Returns currentTime of the loaded file in seconds.

### setCurrentTime(time)
Sets currentTime of the loaded file. This is essentially a seek function.
* `time` (number) - currentTime of audio to be played. Its value must be between 0 and total duration of the file.

### mute()
Mutes the loaded file.

### unmute()
Ummutes the loaded file.

### getVolume()
Returns volume of the loaded file as a number.

### setVolume(value)
Sets volume of the loaded file.
* `value` (number) - volume of the audio. The value must be between 0 and 100.
 
### getFreqData()
Returns Uint8Array that contains byte frequency data of the audio.

## Tips and tricks
* The module uses MediaBufferSourceNode to cover as many browsers as possible. There is also MediaElementSourceNode, but it is supported in less browsers.
* In iOS, source must be loaded on user triggerd action, such as onClick. Otherwise, the state of AudioContext stays suspended.
* In iOS Safari, when the instance is created for the first time, the AudioContext has a sample rate of 48000, while loaded audio files have 44100. The unmatching sample rates cause audio to be distorted. If the sample rates don't match, another instance of AudioContext must be created - then it will have matching sample rate. This module handles it for you.
* Default Android Browser, on the other hand, has sample rate of 48000 for both AudioContext and loaded audio file. Thus it is not required to check for the sample rate.

## License
MIT - refer to [LICENSE.md](LICENSE.md).