//*
//import { play, recordUserSpeech } from './util.mjs';


export const ready = new Promise((resolve)=>{
    resolve();
});

export const hear = async (options={})=>{
    //const audio = await recordUserSpeech(options);
    //play(audio, { sampleRate: 8000 });
}; //*/
// until node has a native module that can locally stt, 
// we use whisper by default at the expense of speed
/*
import { ready, hear } from './whisper-stt.mjs';
export { ready, hear };
//*/