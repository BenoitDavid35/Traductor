// Imports the Google Cloud client library
const speech = require('@google-cloud/speech');
const fs = require('fs');
const async = require('async');

// Creates a client
const apikey = { projectId : 'singular-acumen-234307',	keyFilename : './key.json'}; //key.json à été supprimé pour des raisons de sécurité sur GitHub
const client = new speech.SpeechClient (apikey);

/**
 * transcribe an audio file
 * @param  {object} audio
 * @param  {object} config
 * @return transcription
 */
function transcribe(audio, config){
    // Verify config
  config = config || {};
  config.audioChannelCount = config.audioChannelCount || 1;
	config.enableAutomaticPunctuation = config.enableAutomaticPunctuation || true;
	config.enableSeparateRecognitionPerChannel = config.enableSeparateRecognitionPerChannel || true;
	config.enableWordConfidence = config.enableWordConfidence || true;
	config.encoding = config.encoding || 'LINEAR16';
	config.sampleRateHertz = config.sampleRateHertz || 16000;
	config.languageCode	= config.languageCode || 'fr-FR' ;
	config.maxAlternatives = config.maxAlternatives || 1;
	config.enableWordTimeOffsets = config.enableWordTimeOffsets || true;
	config.speechContexts = config.speechContexts || []

    const request = { audio: audio,
                      config: config };

    // Detects speech in the audio file
    return new Promise(async function (resolve)
	{
        const [response] = await client.recognize(request);
        if(response && response.results)
             resolve(response.results);
        else resolve(false);
    });
}

/**
 * transcribe a short audio file (< 1 min)
 * @param  {string} fileName
 * @param  {object} config
 * @return transcription
 */
function transcribeShortFile(fileName, config){
    // Reads a local audio file and converts it to base64
    const file = fs.readFileSync(fileName);
    const audioBytes = file.toString('base64');

    // The audio file's encoding, sample rate in hertz, and BCP-47 language code
    const audio = { content: audioBytes };
    return transcribe(audio, config);
}


/**
 * transcribe a long audio file (> 1 min)
 * @param  {string} file uri (google storage)
 * @param  {object} config
 * @return transcription
 */
function transcribeURI(uri, config)
{
    const audio = {uri: uri};
    return transcribe(audio, config);
}
exports.transcribeShortFile = transcribeShortFile;

/**
 * test function
 * @return {void}
 */
async function test()
{
    let results = await transcribeShortFile('./audio/tts.wav');
    for(let result of results)
    {
        let transcription = result.alternatives[0].transcript;
        console.log(`channel ${result.channelTag}: ${transcription}`);
    }
}

//test();
