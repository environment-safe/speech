import { Speech } from './src/index.mjs';

//const type = 'node';
const type = 'sherpa-onnx';

(async ()=>{
    const thisSpeech = new Speech({ type });
    await thisSpeech.ready;
    /*
    const enUsVoices = thisSpeech.voices.filter((item)=>{
        const language = item.lang || item.language;
        return language.toLowerCase() === 'en-us';
    });
    const voice = enUsVoices[0].identifier;
    await thisSpeech.speak('I am testing tee tee ess', {
        voice
    });
    //*/
    await thisSpeech.hear();
})();