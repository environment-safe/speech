@environment-safe/speech
========================
Text to Speech and speech recognition in node and the browser. Supports native STT/TTS where possible, falls back to local support or native browser support where appropriate.

Usage
-----
In node this looks like:
```js
import { Speech } from '@environment-safe/speech';
(async ()=>{
    await Speech.ready;
    const voice = Speech.voices[0].name;
    await Speech.speak('I have something to say', { voice });
})();
// node.js STT support is still TBD
```
In the browser, this must occur on an execution context initiated by a user action, like:
```js
import { Speech } from '@environment-safe/speech';
const el = document.getElementById('element-id');
el.addEventListener('click', async ()=>{
    const spoken = await Speech.hear();
    //do something
});
//OR
el.addEventListener('click', async ()=>{
    const voice = Speech.voices[0].name;
    await Speech.speak('I have something to say', { voice });
    //do something
});
```

=== Engine Type Support

| engine type | local | no model | TTS | STT | native |
|-------------|-------|----------|-----|-----|--------|
| browser     |  ✅   |   ✅     | ✅  |  ✅ |   ✅  |
| whisper     |  ✅   |   ❌     | ❌  |  ✅ |   ❌  |
| mac-os-x    |  ✅   |   ✅     | ✅  |  ❌ |   ✅  |
| windows     |  ✅   |   ✅     | ✅  |  ❌ |   ✅  |
| sherpa-onnx |  ✅   |   ❌     | ✅  |  ✅ |   ❌  |
| node        |  ✅   |   ✅     | ✅  |  ❌ |   ❌  |

Supported STT engines are: `browser`, `sherpa-onnx` and `whisper`. Supported TTS engines are: `browser`, `mac-os-x`, `windows`, `node`, and `sherpa-onnx`. Autodetection prefers native, local solutions.

Outside the browser getting command line access to native STT is difficult, so the STT options in node are currently bulky and limited. This should change over time.

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

