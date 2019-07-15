// Imports the Google Cloud client library
const googleTranslate = require('@google-cloud/translate');

// Creates a client
const apikey = { projectId : 'singular-acumen-234307',	keyFilename : './key.json'};
const client = new googleTranslate.Translate (apikey);

/**
 * translates text to a specific language
 * @param {string} text
 * @param {string} to
 */
function translate (text, to)
{
    to   = to || 'en';

    return new Promise((resolve) =>
	{
        if(text && text.length)
        {
            client.translate(text, to, (err, translation) =>
            {
                if(err)     resolve (false);
                else        resolve (translation);
            });
        }
        else resolve(false);
    });
}

/**
 * detect the language of a text
 * @param {string} text
 */
function detectLanguage (text)
{
    return new Promise((resolve) =>
	{
        if(text && text.length)
        {
            client.detect('Hello', (err, detection) =>
            {
                if(err)     resolve(false);
                else        resolve(detection);
            });
        }
        else resolve(false);
    });
}

/**
 * exported functions
 */
exports.translate = translate;
exports.detectLanguage = detectLanguage;


// /**
//  * test function
//  * @return {void}
//  */
// async function test ()
// {
//     console.log(await translate('hello my dear students..'));
//     console.log(await detectLanguage('goodmorning ladies and gentlemens..'));
// }

// test();
