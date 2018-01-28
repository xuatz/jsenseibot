const debug = require('debug')("jsensei");
const googleTranslate = require('google-translate')(process.env.GTRANSLATE_KEY);

const KEYWORD_TRANSLATE = "translate-";
const LANGUAGE_ENGLISH = "en";
const LANGUAGE_JAPANESE = "ja";

const name = 'jsensei';

class JTranslate{
	//guess input language
	translate(text){
		return new Promise((resolve, reject) => {
			var input = "";
			//remove the translate
			if(text) {
				input = this.getTranslateInput(text);
				debug('Actual translation input is : ' + input);
				if(input && input.length > 0){
					this.guessLanguage(input).then(language=>{
						if(language === LANGUAGE_ENGLISH){
							this.translateToJap(input).then(response => {
								if(response && response != "undefined") resolve(this.formatResponse(input, response));
								else reject("Failed to translate " + input);
							});
						} else if (language === LANGUAGE_JAPANESE){
							this.translateToEng(input).then(response => {
								if(response && response != "undefined") resolve(this.formatResponse(input, response));
								else reject("Failed to translate " + input);
							});
						} else {
							resolve(this.formatResponse(input, "Unknown language."));
						}

					});
					
				} else {
					//Invalid syntax
					reject("Please ensure your message comes after the word 'translate'!");
				}
			}
		});
	}

	/**
	 * Guess the input language
	 * @param input - the text to be translated
	 * Output follows google standard
	 * Japanese - ja
	 * English - en
	 */
	guessLanguage(input){
		return new Promise((resolve, reject) => {
			if(input.match(/[\u3000-\u303f\u3040-\u309f\u30a0-\u30ff\uff00-\uff9f\u4e00-\u9faf\u3400-\u4dbf]/)){
				resolve(LANGUAGE_JAPANESE);
			} else {
				resolve(LANGUAGE_ENGLISH);
			}
		});
	}

	/**
	 * Use google translate to guess langauge
	 */
	googleGuessLanguage(input){
		return new Promise((resolve, reject)=>{
			googleTranslate.detectLanguage(input, (err, detection)=>{
				if(err !=null){
					reject(err);
				} else {
					resolve(detection.language);
				}
			});
		});
	}

	formatResponse(originalTxt, translatedTxt){
		return originalTxt + " => " + translatedTxt;
	}

	translateToEng(japText){
		return new Promise((resolve, reject) => {
			try{
				googleTranslate.translate(japText, LANGUAGE_JAPANESE, LANGUAGE_ENGLISH,(err, translation) => {
					debug('Err : ' + JSON.stringify(err));
					debug('Translated : ' + JSON.stringify(translation));
					resolve(translation.translatedText);
				});
			} catch(e){
				reject("Error: " + e);
			}

		});		
	}

	translateToJap(engText){
		return new Promise((resolve, reject) => {
			try{
				googleTranslate.translate(engText, LANGUAGE_ENGLISH, LANGUAGE_JAPANESE,(err, translation) => {
					debug('Err : ' + JSON.stringify(err));
					debug('Translated : ' + JSON.stringify(translation));

					resolve(translation.translatedText);
				});
			} catch(e){
				reject("Error: " + e);
			}
		});	
		
	}

	getTranslateInput(message){
		var input = "";
		if(message.length > 0){
			var msgArr = message.split(" ");
			var inputStart = false;
			var inputArr = [];
			for(let msg of msgArr){
				if(inputStart){
					inputArr.push(msg);
				}
				if(msg.toLowerCase() === KEYWORD_TRANSLATE){
					inputStart = true;
				}
			}
			input = inputArr.join(" ");
		}
		return input;
	}
}
module.exports = JTranslate;