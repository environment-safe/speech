/* global Buffer */
import {  isBrowser, isJsDom } from '@environment-safe/runtime-context';
import * as mod from 'module';
let internalRequire = null;
if(typeof require !== 'undefined') internalRequire = require;
let ensureRequire = null;

let fs = null;
// eslint-disable-net-line no-unused-vars
//let isPlaying = false;
//let text2wav = null;
let portAudio = null;
let SB = null;
//let audioAPIs = null;
//let outputChannels;

import NodeMic from 'node-mic';

const buffer2stream = (buff)=>{
    var stream = new SB.ReadableStreamBuffer({});
    stream.put(buff);
    stream.stop();
    return stream;
};

let initializing = null;

const ready = ()=>{
    return initializing || (initializing = new Promise((resolve, reject)=>{
        if(!ensureRequire) ensureRequire = ()=> (!internalRequire) && (internalRequire = mod.createRequire(import.meta.url));
        ensureRequire();
        fs = internalRequire('fs');
        tmp = internalRequire('tmp');
        //tmp.setGracefulCleanup();
        //text2wav = internalRequire('text2wav');
        SB = internalRequire('stream-buffers');
        portAudio = internalRequire('naudiodon');
        //portAudio.setConsole({log : function(){ }, error:function(){}});
        /*
        audioAPIs = portAudio.getHostAPIs();
        outputChannels = portAudio.getDevices().filter(function(device){
            return !!device.maxOutputChannels;
        });
        */
        resolve();
    }));
};

export const recordUserSpeech = async (options={})=>{
    // eslint-disable-next-line no-async-promise-executor
    return await new Promise(async (resolve, reject)=>{
        try{
            const mic = new NodeMic({
                rate: 16000,
                channels: 1,
                threshold: 10
            });
            const micInputStream = mic.getAudioStream();
            const all = [];
            const dataListener = (data)=>{
                all.push(new Buffer(data));
            };
            const silenceListener = ()=>{
                micInputStream.off('silence', silenceListener);
                mic.stop();
            };
            const stopListener = ()=>{
                micInputStream.off('stopped', stopListener);
                micInputStream.off('data', dataListener);
                const result = Buffer.concat(all);
                resolve(result);
            };
            micInputStream.on('started', ()=>{
                micInputStream.on('stopped', stopListener);
                micInputStream.on('silence', silenceListener);
                micInputStream.on('data', dataListener);
            }); 
            mic.start();
        }catch(ex){
            reject(ex);
        }
    });
}; 

let tmp = null;
export const tempFile = async (body)=>{
    await ready();
    // eslint-disable-next-line no-async-promise-executor
    return await new Promise(async (resolve, reject)=>{
        if(isBrowser || isJsDom){
            throw new Error('Not Supported');
            //todo: support browser temp (currently not needed)
        }else{
            tmp.file(function _tempFileCreated(err, path, fd, cleanupCallback) {
                if(err) return reject(err);
                console.log(body instanceof Buffer, typeof body);
                const buffer = body;
                fs.write(fd, buffer, 0, buffer.length, null, function(error, bytesRead, buffer) {
                    if(error) return reject(error);
                    fs.close(fd);
                    resolve(path);
                });
                resolve(path);
            });
        }
    });
};

export const play = async (sound, options={})=>{//sound is a stream, buffer or filename
    await ready();
    return await new Promise((resolve, reject)=>{
        const aio = new portAudio.AudioIO({
            outOptions: {
                channelCount: 2,
                sampleFormat: portAudio.SampleFormat16Bit,
                sampleRate: options.sampleRate || 12000,
                deviceId: -1, // default
                closeOnError: false //tolerate slow streams
            }
        });
        let stream = sound;
        if(sound.constructor === Uint8Array){
            stream = buffer2stream(Buffer.from(sound));
        }
        if(typeof sound === 'string'){
            stream = fs.readableStream(sound);
        }
        if(sound instanceof Buffer){
            stream = buffer2stream(sound);
        }
        //isPlaying = true;
        stream.on('end', ()=>{
            setTimeout(()=>{
                aio.quit();
                setTimeout(()=>{
                    //isPlaying = false;
                    resolve();
                }, 0);
            }, 1000);
        });
        stream.pipe(aio);
        aio.start();
    });
};