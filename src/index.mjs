import {
    isBrowser, isJsDom, os
} from '@environment-safe/runtime-context';

const supportedNativeEnvironments = [
    'mac-os-x', 'windows'
];

export class Speech{
    constructor(options={}){
        const osFileLabel = os.replace(/ /g, '-');
        this.options = options;
        if(!this.options.type){
            this.options.type = (isBrowser || isJsDom)?'browser':(
                (
                    this.options.native &&
                    supportedNativeEnvironments.indexOf(osFileLabel) !== -1
                )?
                    osFileLabel:
                    'node'
            );
        }
        const ttsType = this.options.ttsType || this.options.type;
        const sttType = this.options.sttType || this.options.type;
        this.ttsLoading = import(`./${ttsType}-tts.mjs`);
        this.sttLoading = import(`./${sttType}-stt.mjs`);
        (async ()=>{
            this.tts = await this.ttsLoading;
            this.ttsName = `${ttsType}-tts`;
        })();
        (async ()=>{
            this.stt = await this.sttLoading;
            this.sttName = `${sttType}-stt`;
        })();
        Object.defineProperty(this, 'ready', {
            set: ()=>{},
            get: function(){
                return Promise.all([
                    this.ttsLoading,
                    this.sttLoading
                ]);
            }
        });
        Object.defineProperty(this, 'voices', {
            set: ()=>{},
            get: ()=>{
                return this.tts?this.tts.getVoiceList():[];
            }
        });
    }
    
    async speak(text){
        await this.ready;
        return await this.tts.speak(text);
    }
    
    async hear(){
        await this.ready;
        return await this.stt.hear();
    }
    
}

const defaultSpeech = new Speech();

Object.defineProperty(Speech, 'ready', {
    set: ()=>{},
    get: function(){
        return defaultSpeech.ready;
    }
});

Object.defineProperty(Speech, 'voices', {
    set: ()=>{},
    get: ()=>{
        return defaultSpeech.tts?defaultSpeech.tts.getVoiceList():[];
    }
});

Speech.speak = (text, options)=>{
    return defaultSpeech.speak(text, options);
};

Speech.hear = (options)=>{
    return defaultSpeech.hear(options);
};

export class AvatarSpeech{
    constructor(options = {}){
        this.options = options;
        
    }
    
    speak(text){
        return Speech.speak(text, this.options);
    }
    
    hear(){
        return Speech.hear(this.options);
    }
}
