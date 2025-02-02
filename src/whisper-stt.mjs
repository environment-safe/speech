import { tempFile, recordUserSpeech } from './util.mjs';

import { whisper } from 'whisper-node';

export const ready = new Promise((resolve)=>{
    resolve();
});

export const hear = async (options={})=>{
    const audio = await recordUserSpeech(options);
    const location = await tempFile(audio);
    const transcript = await whisper(location);
    return transcript;
};