import { isBrowser, isJsDom } from 'browser-or-node';

let SpeechRecognition = null;
if(isBrowser || isJsDom){
    SpeechRecognition = (
        window.SpeechRecognition || window.webkitSpeechRecognition
    );
}

export const hear = async ()=>{
    return await new Promise((resolve, reject)=>{
        try{
            const recognition = new SpeechRecognition();
            
            // This runs when the speech recognition service starts
            recognition.onstart = function() { };
            
            recognition.onspeechend = function() {
                recognition.stop();
            };
            
            // This runs when the speech recognition service returns result
            recognition.onresult = function(event) {
                console.log(event);
                const transcript = event.results[0][0].transcript;
                //const confidence = event.results[0][0].confidence;
                recognition.stop();
                resolve(transcript);
            };
            
            // start recognition
            recognition.start();
        }catch(ex){
            reject(ex);
        }
    });
};