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
					googleTranslate.detectLanguage(input, (err, detection)=>{
						let language = detection.language;
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
					resolve("Please ensure your message comes after the word 'translate'!");
				}
			}
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