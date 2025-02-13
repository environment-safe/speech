import { isBrowser, isJsDom } from 'browser-or-node';

let Synthesis = null;
let TextSynthesis = null;
if(isBrowser || isJsDom){
    Synthesis = window.speechSynthesis;
    TextSynthesis = window.SpeechSynthesisUtterance;
}

export const ready = new Promise((resolve)=>{
    if ('onvoiceschanged' in Synthesis) {
        setTimeout(resolve);
    } else {
        resolve();
    }
});

export const getVoiceList = ()=>{
    return Synthesis.getVoices();
};

export const speak = async (text, options={})=>{
    const speakable = new TextSynthesis(text);
    if(options.voice) speakable.voice = options.voice;
    if(options.pitch) speakable.pitch = options.pitch;
    if(options.rate) speakable.rate = options.rate;
    await new Promise((resolve)=>{
        speakable.onend = resolve;
        window.speechSynthesis.speak(speakable);
    });
};