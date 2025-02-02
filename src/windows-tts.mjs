import { getVoiceList, synthesize } from '@echogarden/windows-media-tts';
import { play } from './util.mjs';

export const ready = new Promise((resolve)=>{
    resolve();
});

export { getVoiceList };

export const speak = async (text, options={})=>{
    const { audioSamples, sampleRate } = synthesize(text, {
        voice: options.voice || 'en-US',
        rate: options.rate || 0.25,
        pitchMultiplier: options.pitch || 1.0,
        volume: 0.8,
    });
    const converted = new Uint8Array(
        audioSamples.buffer, 
        audioSamples.byteOffset, 
        audioSamples.byteLength
    );
    await play(converted, { sampleRate });
};