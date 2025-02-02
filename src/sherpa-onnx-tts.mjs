let sherpa_onnx = null;
import * as mod from 'module';
let internalRequire = null;
if(typeof require !== 'undefined') internalRequire = require;
let ensureRequire = null;
import { play } from './util.mjs';

function createOfflineTts() {
    let offlineTtsVitsModelConfig = {
        model: './models/en_US-amy-low.onnx',
        tokens: './models/tokens.txt',
        dataDir: './models/espeak-ng-data',
        noiseScale: 0.667,
        noiseScaleW: 0.8,
        lengthScale: 1.0,
    };
    let offlineTtsModelConfig = {
        offlineTtsVitsModelConfig: offlineTtsVitsModelConfig,
        numThreads: 1,
        debug: 1,
        provider: 'cpu',
    };
    
    let offlineTtsConfig = {
        offlineTtsModelConfig: offlineTtsModelConfig,
        maxNumSentences: 1,
    };
    
    return sherpa_onnx.createOfflineTts(offlineTtsConfig);
}

export const ready = new Promise((resolve)=>{
    if(!ensureRequire) ensureRequire = ()=> (!internalRequire) && (internalRequire = mod.createRequire(import.meta.url));
    ensureRequire();
    sherpa_onnx = internalRequire('sherpa-onnx');
    createOfflineTts();
    resolve();
});

export const getVoiceList = ()=>{
    return [];
};

export const speak = async (text, options={})=>{
    const tts = createOfflineTts();
    const audio = tts.generate({
        text,
        sid: 0, //speaker 0
        speed: 1.0
    });
    play(audio);
    /*
    // Create the Speaker instance
    const speaker = new Speaker({
        channels: 1,          // 2 channels
        bitDepth: 32,         // 16-bit samples
        sampleRate: sampleRate     // 44,100 Hz sample rate
    });
    await new Promise((resolve)=>{
        speaker.on('end', ()=>{
            //resolve();
        });
        speaker.end(converted);
        resolve();
    }); //*/
};