import * as tts from '@echogarden/macos-native-tts';
import * as mod from 'module';
let internalRequire = null;
if(typeof require !== 'undefined') internalRequire = require;
let ensureRequire = null;
import { play } from './util.mjs';

export const ready = new Promise((resolve)=>{
    if(!ensureRequire) ensureRequire = ()=> (!internalRequire) && (internalRequire = mod.createRequire(import.meta.url));
    ensureRequire();
    resolve();
});

export const getVoiceList = ()=>{
    return tts.getVoiceList();
};

export const speak = async (text, options={})=>{
    const { audioSamples, sampleRate } = tts.synthesize(text, {
        voice: options.voice || 'en-US',
        rate: options.rate || 0.5,
        pitchMultiplier: options.pitch || 1.0,
        volume: 0.6,
    });
    const converted = new Uint8Array(
        audioSamples.buffer, 
        audioSamples.byteOffset, 
        audioSamples.byteLength
    );
    await play(converted, { sampleRate });
    /* The old way
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