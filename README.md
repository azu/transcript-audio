# Transcript Audio

Transcript your audio file like Podcast using [SpeechRecognition](https://developer.mozilla.org/en-US/docs/Web/API/SpeechRecognition) and Virtual Audio Device.

## Requirements

- Chrome
    - depend on [SpeechRecognition](https://developer.mozilla.org/en-US/docs/Web/API/SpeechRecognition) implementation
- [BlackHole](https://github.com/ExistentialAudio/BlackHole) on macOS
    - If you know other application, please let me it.

## Usage

1. Install [BlackHole](https://github.com/ExistentialAudio/BlackHole) into your PC
    - [BlackHole](https://github.com/ExistentialAudio/BlackHole) is virtual loopback audio device
2. Visit <https://transcript-audio.netlify.app/>
3. Click "Play" button at first and Confirm "OK" for use your mike🎤
4. **Reload** the page
5. Drag and Drop your audio file you want to transcript to following
6. Play audio and want for transcription.

:memo: Input/Output device should be [BlackHole](https://github.com/ExistentialAudio/BlackHole) during transcription.
If Input/Output device is empty, you need to reload the page.

## Mechanism

This application set Input/Output audio device to Virtual Audio device like [BlackHole](https://github.com/ExistentialAudio/BlackHole).

It aims to create loop back device by setting input/output is same device.

- Play audio --> loopback device
- [SpeechRecognition](https://developer.mozilla.org/en-US/docs/Web/API/SpeechRecognition) recognize the sound from loopback device
- transcript the text for the audio 

## Contributing

1. Fork it!
2. Create your feature branch: `git checkout -b my-new-feature`
3. Commit your changes: `git commit -am 'Add some feature'`
4. Push to the branch: `git push origin my-new-feature`
5. Submit a pull request :D

## License

MIT

## Supporter

<a href="https://www.netlify.com">
  <img src="https://www.netlify.com/img/global/badges/netlify-light.svg"/>
</a>

