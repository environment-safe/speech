import * as mod from 'module';
let internalRequire = null;
if(typeof require !== 'undefined') internalRequire = require;
let ensureRequire = null;
let text2wav = null;
import { play } from './util.mjs';

export const ready = new Promise((resolve)=>{
    if(!ensureRequire) ensureRequire = ()=> (!internalRequire) && (internalRequire = mod.createRequire(import.meta.url));
    ensureRequire();
    text2wav = internalRequire('text2wav');
    resolve();
});

const staticVoiceList = [ 
    {
        name:'Andy',
        lang: 'en-us',
    }, 
    {
        name: 'Annie',
        lang: 'en-us',
    }, 
    {
        name: 'AnxiousAndy',
        lang: 'en-us',
    }, 
    {
        name: 'Denis',
        lang: 'en-us',
    }, 
    {
        name: 'Gene',
        lang: 'en-us',
    }, 
    {
        name: 'Gene2',
        lang: 'en-us',
    }, 
    {
        name: 'Jacky',
        lang: 'en-us',
    }, 
    {
        name: 'Lee',
        lang: 'en-us',
    }, 
    {
        name: 'Mario', 
        lang: 'en-us',
    },
    {
        name: 'Michael',
        lang: 'en-us',
    }, 
    {
        name: 'Mr serious',
        lang: 'en-us',
    }, 
    {
        name: 'Storm',
        lang: 'en-us',
    }, 
    {
        name: 'Tweaky',
        lang: 'en-us',
    }, 
    {
        name: 'aunty',
        lang: 'en-us',
    }, 
    {
        name: 'boris',
        lang: 'en-us',
    }, 
    {
        name: 'croak',
        lang: 'en-us',
    }, 
    {
        name: 'f1',
        lang: 'en-us',
    }, 
    {
        name: 'f2', 
        lang: 'en-us',
    },
    {
        name: 'f3',
        lang: 'en-us',
    }, 
    {
        name: 'f4',
        lang: 'en-us',
    }, 
    {
        name: 'f5',
        lang: 'en-us',
    }, 
    {
        name: 'iven',
        lang: 'en-us',
    }, 
    {
        name: 'iven2',
        lang: 'en-us',
    }, 
    {
        name: 'iven3',
        lang: 'en-us',
    }, 
    {
        name: 'john',
        lang: 'en-us',
    }, 
    {
        name: 'kaukovalta',
        lang: 'en-us',
    }, 
    {
        name: 'klatt',
        lang: 'en-us',
    }, 
    {
        name: 'klatt2', 
        lang: 'en-us',
    },
    {
        name: 'klatt3',
        lang: 'en-us',
    }, 
    {
        name: 'klatt4',
        lang: 'en-us',
    }, 
    {
        name: 'linda',
        lang: 'en-us',
    }, 
    {
        name: 'm1',
        lang: 'en-us',
    }, 
    {
        name: 'm2',
        lang: 'en-us',
    }, 
    {
        name: 'm3',
        lang: 'en-us',
    }, 
    {
        name: 'm4',
        lang: 'en-us',
    }, 
    {
        name: 'm5',
        lang: 'en-us',
    }, 
    {
        name: 'm6',
        lang: 'en-us',
    }, 
    {
        name: 'm7',
        lang: 'en-us',
    }, 
    {
        name: 'm8',
        lang: 'en-us',
    }, 
    {
        name: 'max', 
        lang: 'en-us',
    },
    {
        name: 'michel',
        lang: 'en-us',
    }, 
    {
        name: 'norbert',
        lang: 'en-us',
    }, 
    {
        name: 'quincy',
        lang: 'en-us',
    }, 
    {
        name: 'rob',
        lang: 'en-us',
    }, 
    {
        name: 'robert',
        lang: 'en-us',
    }, 
    {
        name: 'steph',
        lang: 'en-us',
    }, 
    {
        name: 'steph2',
        lang: 'en-us',
    }, 
    {
        name: 'steph3',
        lang: 'en-us',
    }, 
    {
        name: 'travis', 
        lang: 'en-us',
    },
    {
        name: 'whisper',
        lang: 'en-us',
    }, 
    {
        name: 'whisperf',
        lang: 'en-us',
    }, 
    {
        name: 'zac',
        lang: 'en-us',
    }
];

export const getVoiceList = ()=>{
    return staticVoiceList;
};

export const speak = async (text, options={})=>{
    const audio = await text2wav(text, {     
        voice : options.voice || 'en-us' 
    });
    await play(audio);
};