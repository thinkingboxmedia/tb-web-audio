# tb-web-audio

[![experimental](http://badges.github.io/stability-badges/dist/experimental.svg)](http://github.com/badges/stability-badges)

Simplified Web Audio API with cross-browser support. In any web project, this module is optimized for:
* Custom sound track
* Custom audio player
* Audio visualization

### Browser Support
As of May 2016, this module has been tested with the following devices and browsers:
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
let webAudio = new WebAudio();
webAudio.load('sample.mp3', () => {
    console.log('audio loaded');
}, () => {
    console.log('audio ended');
}, true, false);
```
For more detailed example, please refer to [example.js](example.js).

# Methods

### load(src, [onload, onended, autoPlay, loop])
Loads audio file. Only one audio file is loaded at once - if `load` is called twice, the only the second file will be loaded.
* `src` (string) - relative/absolute path to the audio source.
* `onload` (function, optional) - callback function after audio source is loaded. Default is `null`.
* `onended` (function, optional) - callback function after audio source has ended playing. Default is `null`.
* `autoPlay` (boolean, optional) - option for the aoudio to be auto-played after loading. Default is `true`.
* `loop` (boolean, optional) - option for audio to be continuously looped. Default is `true`.

### play()
Plays the loaded file. If the file is already playing, no action is taken.

### pause()
Pauses the loaded file. If the file is already paused, no action is taken.

### getDuration()
Returns total duration of the loaded file as a number.

### getCurrentTime()
Returns currentTime of the loaded file as a number.

### setCurrentTime(time)
Sets currentTime of the loaded file. This is a seek function.
* `time` (number) - currentTime of audio to be played. Its value must be between 0 and total duration of the file.

### mute()
Mutes the loaded file.

### unmute()
Ummutes the loaded file.

### getVolume()
Returns volume of the loaded file as a number.

### setVolume(value)
Sets volume of the loaded file.
* `value` (number) - volume of the audio. Its value must be between 0 and 100.
 
### getFreqData()
Returns Uint8Array that consists byte frequency data of the audio.