var inquirer = require('inquirer');

var wrongGuesses = [];

function Word(){
	
	this.words = ["BORBORYGMI", "CACHINNATION", "CICATRIZATION", "DEGLUTITION",'DIAPHORESIS','ERUCTATION','FLATUS','HORRIPILATION','LACHRYMATION','MASTICATION','NICTITATION','OBDORMITION','PANDICULATION','RHINORRHOEA','SINGULTUS','STERNUTATION','TUSSICATION'];
	
	this.randomWord = this.words[Math.floor(Math.random() * this.words.length)].toLowerCase();

	this.answers = this.randomWord.split("");

	this.blanks = this.randomWord.replace(/([a-zA-Z])/g, "_").split("");

	this.allGuesses = [];

	this.wrongGuesses = [];

	this.displayBlanks = function(){
		console.log("\n");
		console.log(this.blanks.join(" "));
	};

	this.displayWrongGuesses = function(){
		console.log("\n");
		console.log("incorrect guesses: " + this.wrongGuesses.join(","));
		if(this.wrongGuesses.length < 7)
			console.log("Guesses left: " + (7-this.wrongGuesses.length));
		else{
			console.log("No more room for mistakes... miss this one and you are done!!")
		}
	};

};

function Letter(input){
	this.guess = input;
	this.correct;
	this.guessHandler = function(word){
		for(i=0; i<word.answers.length; i++){
			if(word.answers[i] === this.guess){
				this.correct = true;
				word.blanks[i] = this.guess;
			}
		}
		if(this.correct){
			console.log("Hey, you got one!");
		}
		else{
			console.log("whoops, try again");
			word.wrongGuesses.push(this.guess);
		}
		word.allGuesses.push(this.guess);
	};
};

function guessInquiry(word){
	console.log("\n");
	inquirer.prompt([

		{
			name: 'guess',
			type: 'input',
			message: 'Enter a letter...',
			validate: function(input, err){
				var alreadyGuessed;
				for(i=0; i<=word.allGuesses.length; i++){
					if(input === word.allGuesses[i]){
						alreadyGuessed = true;
					}
				}
				if(alreadyGuessed){
					console.log("\nyou've already Guessed that letter")
					return false;
				}
				else if(input.length > 1){
					console.log("\nyou may only enter one letter");
					return false;
				}
				else if(!input.match(/[A-zA-Z]/)){
					console.log("\nonly letters of the alphabet please!");
					return false;
				}
				else{
					return true;
				}
			}
		}

	]).then(function(answer){
		var letter = new Letter(answer.guess.toLowerCase());
		letter.guessHandler(word);
		word.displayBlanks();
		if(word.wrongGuesses.length > 7){
			console.log("you've used all of your guesses :(\n\nyou lose!");
			console.log("the correct answer was: " + word.randomWord);
			playAgain();
		}
		else if(word.blanks.join("") === word.answers.join("")){
			console.log("you win");
			playAgain();
		}
		else{
			word.displayWrongGuesses();
			guessInquiry(word);
		}
		
	});
};

function playAgain(){

	inquirer.prompt([
		{
			name: 'playAgain',
			type: 'confirm',
			message: 'Would you like to play again?',
			default: true,
		}
	]).then(function(answer){
		if(answer.playAgain){
			newGame();
		}
		else{
			console.log('Fine... maybe some other time.');
		}
	});
};



function newGame(){
	console.log('Welcome to Hangman!\n');

	var word = new Word();

	word.displayBlanks();

	guessInquiry(word);

}

newGame();