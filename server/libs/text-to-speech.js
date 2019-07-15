const fs = require('fs');
const util = require('util');
const async = require('async');

// Imports the Google Cloud client library
const textToSpeech = require('@google-cloud/text-to-speech').v1beta1;

// Creates a client
const apikey = { projectId : 'singular-acumen-234307',	keyFilename : './key.json'};
const client = new textToSpeech.TextToSpeechClient (apikey);


/**
 * generate audio data from text using text to speech
 * @param {string} text
 * @param {string} language
 * @param {object} voice
 * @param {object} format
 */
function speak(text, language, voice, format)
{
    format = format || {};
    voice  = voice  || {};
    var audio = false;
    console.log(language);
    let lang = language;
    
    if(language == 'pt') {
      lang = 'pt-BR-Standard-A';
    }else if(language == 'fr') {
      lang = 'fr-FR-Standard-B';  
    }else if(language == 'en') {
      lang = 'en-GB-Standard-A';   
    }else if(language == 'de') {
      lang = 'de-DE-Standard-A';   
    }else if(language == 'it') {
      lang = 'it-IT-Standard-A';   
    }else if(language == 'es') {
      lang = 'es-ES-Standard-A';   
    }else if(language == 'ru') {
      lang = 'ru-RU-Standard-A';   
    }else if(language == 'ja') {
      lang = 'ja-JP-Standard-A';   
    }
    console.log('lang');
    console.log(language+""+lang);
    return new Promise((resolve) =>
	{
        if(text && text.length)
        {
            const request =
            {
                input       : { ssml            : '<speak>'+text+'</speak>'},
                voice       : { languageCode    : language,
                                name            : lang },
                audioConfig : { audioEncoding   : format.encoding || 'LINEAR16',
                                sampleRateHertz : format.sampleRate || 16000,
                                effectsProfileId: [ "telephony-class-application" ],
                                volumeGainDb    : format.gain || 0,
                                pitch           : voice.pitch || "1.20",
				                speakingRate    : voice.rate || "0.93"  }
            };

            client.synthesizeSpeech(request, (err, response) =>
            {
                if(!err)    audio = response.audioContent;
                resolve(audio);
            });
        }
        else resolve(false);
    });
}

/**
 * generates audio file from text using text to speech
 * @param {string} text
 * @param {string} file
 * @param {string} language
 * @param {object} voice
 * @param {object} format
 */
function speakToFile (text, file, language, voice, format)
{
    return new Promise(async function (resolve)
	{
	    let audio = await speak(text, language, voice, format);
        if(audio)
        {
            fs.writeFile(file, audio, (err) =>
            {
                if(err)     resolve(false);
                else        resolve(true);
            });
        }
        else                resolve(false);
    });
}
/**
 * exported functions
 */
exports.speak = speak;
exports.speakToFile = speakToFile;


/**
 * test function
 * @return {void}
 */
async function test ()
{
    let result = await speakToFile('Je suis ton père ! Rejoins le coté obscur de la force Luke !', '../audio/tts.wav', '', '', '');
    console.log(result===true ?  'success' : 'failure');
}

//test();
