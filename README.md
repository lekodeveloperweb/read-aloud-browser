Read Aloud Browser
---

Simple package to encapsulate the Browser API [SpeechSynthesis]("https://developer.mozilla.org/en-US/docs/Web/API/SpeechSynthesis").
See compatibility [here]("https://developer.mozilla.org/en-US/docs/Web/API/SpeechSynthesis#browser_compatibility")

## Usage

As a `npm` dependency:

```bash

npm i -s @lekodeveloperweb/read-aloud-browser

```

Via `cdn`:


```html

<script src="unpkg.com/@lekodeveloperweb/read-aloud-browser@1.0.0/index.js"></script>

```

add in your project a `.npmrc` file:

````bash
#.npmrc

@lekodeveloperweb=registry=https://npm.pkg.github.com

````


```typescript

import {ReadAloudAPI} from '@lekodeveloperweb/read-aloud-browser';
// or
window.ReadAloudAPI


try {
  // note: on create instance the method populateVoiceList() is called
  const readAloud = new ReadAloud();
  readAloud.voices; (return SpeechSynthesis[]) // list of voice browser supported
  readAloud.isChromiumBased(): boolean; // utils: verify if is a browser chromium based
  readAloud.selectVoice(readAloud.voices[0]): void; // select a default voice to speak
  // main method to speak a sentence
  readAloud.speak(
    sentence: string, // sentence to speak
    voice: SpeechSynthesisVoice = [default: selectedVoice], // voice you want use to speak sentence
    onStart?: (ev: SpeechSynthesisEvent) => void, // Event dispatched on start speaking
    onEnd?: (ev: SpeechSynthesisEvent) => void, // Event dispatched on end speaking
    voiceSpeed = 1,  // change voice speed
    volume = 1,  // change voice volume
    rate = 1,  // change voice rate
  ): void;
  readAloud.populateVoiceList(): Promise<void> // Populate voices supported by browser. This method will called always on create a new instance.

} catch(err) { // if it's not supported catch a throw exception
    //error.message = "SpeechSynthesis API is not supported in this browser"
}


```
