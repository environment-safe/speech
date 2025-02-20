/* global describe:false */
import { chai } from '@environment-safe/chai';
import { it, configure } from '@open-automaton/moka';
import { Speech } from '../src/index.mjs';
const should = chai.should();

describe('module', ()=>{
    
    configure({
        wantsInput : (context, actions)=>{
            if(context.type === 'click') actions.click();
        } 
    });
    
    describe('performs a simple test suite', ()=>{
        it('lists native voices', async ()=>{
            should.exist(Speech);
            should.exist(Speech.ready);
            await Speech.ready;
            should.exist(Speech.speak);
            should.exist(Speech.voices);
            Speech.voices.length.should.be.above(2);
        });
        
        it('speaks', async function(){
            this.timeout(15000);
            await Speech.ready;
            const enUsVoices = Speech.voices.filter((item)=>{
                const language = item.lang || item.language;
                return language.toLowerCase() === 'en-us';
            });
            const voice = enUsVoices[0].identifier;
            await Speech.speak('I am testing tee tee ess', {
                voice
            });
        });
        
        it.skip('speaks from an instance', async function(){
            this.timeout(15000);
            const thisSpeech = new Speech({type: 'sherpa-onnx'});
            await thisSpeech.ready;
            const enUsVoices = thisSpeech.voices.filter((item)=>{
                const language = item.lang || item.language;
                return language.toLowerCase() === 'en-us';
            });
            const voice = enUsVoices[0].identifier;
            await thisSpeech.speak('I am testing tee tee ess', {
                voice
            });
        });
    });
});

