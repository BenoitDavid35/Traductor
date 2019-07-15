const tts = require("./libs/text-to-speech.js");
const asr = require("./libs/speech-to-text.js");
const trans = require("./libs/translation.js");

const async = require("async");

function chaineAleatoire(nbcar)
{
	var ListeCar = new Array("a","b","c","d","e","f","g","h","i","j","k","l","m","n","o","p","q","r","s","t","u","v","w","x","y","z","0","1","2","3","4","5","6","7","8","9");
	var Chaine ='';
	for(i = 0; i < nbcar; i++)
	{
		Chaine = Chaine + ListeCar[Math.floor(Math.random()*ListeCar.length)];
	}
	return Chaine;
}

async function vocalTranslator(langage, texte){
    /*texte = await asr.transcribeShortFile('./audio/tts.wav');
    texte = JSON.stringify(texte);
    let json = JSON.parse(texte);
    let transcription = json[0].alternatives[0].transcript;
    console.log(transcription);*/
    // console.log('tts : '+tts+' trans : '+trans);
    let translated = await trans.translate(texte,langage);
    let id = chaineAleatoire(30);
    let nameFile = 'audio/'+id+'.wav';
    // console.log(nameFile);
    let resultat = await tts.speakToFile(translated,nameFile,langage);
    await console.log(translated+' nameFile : '+nameFile+ '  lg:'+langage);
    return [nameFile,translated,id];
 }

exports.vocalTranslator = vocalTranslator;

//test()
