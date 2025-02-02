import * as mod from 'module';
let internalRequire = null;
if(typeof require !== 'undefined') internalRequire = require;
let ensureRequire = null;

let sherpa_onnx = null;
import { tempFile, recordUserSpeech } from './util.mjs';

export const ready = new Promise((resolve)=>{
    if(!ensureRequire) ensureRequire = ()=> (!internalRequire) && (internalRequire = mod.createRequire(import.meta.url));
    ensureRequire();
    sherpa_onnx = internalRequire('sherpa-onnx');
    resolve();
});

export const hear = async (options={})=>{
    const audio = await recordUserSpeech(options);
    //play(audio, { sampleRate: 8000 });
    //*
    const location = await tempFile(audio);
    const recognizer = sherpa_onnx.createOfflineRecognizer({
        modelConfig: {
            nemoCtc: { model: './models/nemo-ctc/model.int8.onnx' },
            tokens: './models/nemo-ctc/tokens.txt',
        }
    });
    const stream = recognizer.createStream();
    const waveFilename = location;
    const wave = sherpa_onnx.readWave(waveFilename);
    stream.acceptWaveform(wave.sampleRate, wave.samples);
    
    recognizer.decode(stream);
    const text = recognizer.getResult(stream).text;
    console.log(text);
    
    stream.free();
    recognizer.free();
    //*/
};