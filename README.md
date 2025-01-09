@environment-safe/speech
========================
Text to Speech and speech recognition in node and the browser (currently only supports OSX in node, but others are coming).

Usage
-----

First off you must stub `@echogarden/macos-native-tts` in the browser (you can point it at anything, I recommend something that is already loaded).

text to speech is just: 
```js
import { Speech } from '@environment-safe/speech';
(async ()=>{
    await Speech.ready;
    const voice = Speech.voices[0].name;
    await Speech.speak('I have something to say', { voice });
})();
```
(In the browser, this must occur on a execution context initiated by a user action)

speech to text is (currently only working in the browser):
```js
import { Speech } from '@environment-safe/speech';
(async ()=>{
    await Speech.ready;
    const voice = Speech.voices[0].name;
    await Speech.listen((spokenString)=>{
        //do something with the heard text
    }, { });
})();
```

Testing
-------

Run the es module tests to test the root modules
```bash
npm run import-test
```
Because we don't currently support wantsInput on the Speech API you have to run the demo to test in the browser. To do that:

```bash
npm run local-server
```

Development
-----------
All work is done in the .mjs files and will be transpiled on commit to commonjs and tested.

If the above tests pass, then attempt a commit which will generate .d.ts files alongside the `src` files and commonjs classes in `dist`

