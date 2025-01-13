import { isBrowser, isJsDom } from 'browser-or-node';
import * as tts from '@echogarden/macos-native-tts';
import * as mod from 'module';
//import * as path from 'path';
let internalRequire = null;
if(typeof require !== 'undefined') internalRequire = require;
let ensureRequire = null;

let Synthesis = null;
let TextSynthesis = null;
const Speech = {};
const defaultOptions = {
    //voice: '',
    rate: 0.7,
    pitch: 1.0
};
if(isBrowser || isJsDom){
    Synthesis = window.speechSynthesis;
    TextSynthesis = window.SpeechSynthesisUtterance;
    const ready = new Promise((resolve)=>{
        if ('onvoiceschanged' in Synthesis) {
            setTimeout(resolve);
        } else {
            resolve();
        }
    });
    
    Object.defineProperty(Speech, 'ready', {
        set: ()=>{},
        get: function(){
            return ready;
        }
    });
    
    Object.defineProperty(Speech, 'voices', {
        set: ()=>{},
        get: function(){
            return Synthesis.getVoices();
        }
    });
    
    const say = async (text, options=defaultOptions)=>{
        const speakable = new TextSynthesis(text);
        if(options.voice) speakable.voice = options.voice;
        if(options.pitch) speakable.pitch = options.pitch;
        if(options.rate) speakable.rate = options.rate;
        window.speechSynthesis.speak(speakable);
        await new Promise((resolve)=>{
            speakable.onend = resolve;
        });
    };
    
    Object.defineProperty(Speech, 'speak', {
        set: ()=>{},
        get: function(text, options){
            return say;
        }
    });
    
    const hear = async (handler, options=defaultOptions)=>{
        var SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        var recognition = new SpeechRecognition();
        
        // This runs when the speech recognition service starts
        recognition.onstart = function() { };
        
        recognition.onspeechend = function() {
            recognition.stop();
        };
        
        // This runs when the speech recognition service returns result
        recognition.onresult = function(event) {
            var transcript = event.results[0][0].transcript;
            var confidence = event.results[0][0].confidence;
            handler(transcript, confidence);
            recognition.stop();
        };
        
        // start recognition
        recognition.start();
    };
    
    Object.defineProperty(Speech, 'listen', {
        set: ()=>{},
        get: function(text, options){
            return hear;
        }
    });
    
}else{
    if(!ensureRequire) ensureRequire = ()=> (!internalRequire) && (internalRequire = mod.createRequire(import.meta.url));
    ensureRequire();
    const Speaker = internalRequire('speaker');
    let listVoices = tts.getVoiceList;
    Object.defineProperty(Speech, 'ready', {
        set: ()=>{},
        get: function(){
            // eslint-disable-next-line no-async-promise-executor
            return new Promise(async (resolve, reject)=>{
                resolve();
            });
        }
    });
    
    Object.defineProperty(Speech, 'voices', {
        set: ()=>{},
        get: function(){
            return listVoices();
        }
    });
    
    const say = async (text, options=defaultOptions)=>{
        const { audioSamples, sampleRate } = tts.synthesize(text, {
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
        });
    };
    
    Object.defineProperty(Speech, 'speak', {
        set: ()=>{},
        get: function(text, options){
            return say;
        }
    });
}

export { Speech };

/**
 * A JSON object
 * @typedef { object } JSON
 */
