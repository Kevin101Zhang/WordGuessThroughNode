var mysql = require("mysql");
var inquirer = require("inquirer");

var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "root123",
    database: "WordGuess"
});

connection.connect(function (err, res) {
    if (err) throw err;
    console.log(`Connected through $${connection.threadId}`);
    startWordGuess();
});

var isAlphabet = function (check) {
    return /^[A-Z]$/i.test(check);
}
var lives = 8;

function startWordGuess() {
    console.log("Welcome to Word Guess! Please Select A Difficulty...\n");
    inquirer
        .prompt([
            {
                name: "difficulty",
                type: "rawlist",
                message: "Please Select Your Difficulty...\n",
                choices: ["BEGINNER", "INTERMEDIATE", "ADVANCED", "INSANE"]
            },
            {
                name: "confirmation",
                type: "rawlist",
                message: `ARE YOU SURE...\n?`,
                choices: ["YES", "NO"]
            }
        ])
        .then(function (answer) {
            if (answer.confirmation.toUpperCase() === "NO") {
                console.log("Returning to Select Menu...\n");
                return startWordGuess();
            }
            console.log(`Difficulty selected is ${answer.difficulty}`);

            switch (answer.difficulty.toUpperCase()) {
                case ("BEGINNER"):
                    startBeginner();
                    break;

                case ("INTERMEDIATE"):
                    startIntermediate();
                    break;

                case ("ADVANCED"):
                    startAdvanced();
                    break;

                case ("INSANE"):
                    startInsane();
                    break;
            }
        })
}

function startBeginner() {
    console.log("Welcome to Beginner Word Guess...\n");
    var currentWord;
    connection.query("SELECT * FROM beginnerWords ORDER BY RAND() LIMIT 1", function (err, res) {
        if (err) throw err;

        for (var i = 0; i < res.length; i++) {
            console.log(typeof res[i].word);
            currentWord = res[i].word;
        }
        console.log(currentWord);
        var wordArr = currentWord.split("");
        console.log(wordArr);
        gameSetup(wordArr);
    })
}

function startIntermediate() {
    console.log("Welcome to Intermediate Word Guess...\n");
    var currentWord;
    connection.query("SELECT * FROM intermediateWords ORDER BY RAND() LIMIT 1", function (err, res) {
        if (err) throw err;

        for (var i = 0; i < res.length; i++) {
            console.log(typeof res[i].word);
            currentWord = res[i].word;
        }
        console.log(currentWord);
        var wordArr = currentWord.split("");
        console.log(wordArr);
        gameSetup(wordArr);
    })
}
function startAdvanced() {
    console.log("Welcome to Advanced Word Guess...\n");
    var currentWord;
    connection.query("SELECT * FROM advanceWords ORDER BY RAND() LIMIT 1", function (err, res) {
        if (err) throw err;

        for (var i = 0; i < res.length; i++) {
            console.log(typeof res[i].word);
            currentWord = res[i].word;
        }
        console.log(currentWord);
        var wordArr = currentWord.split("");
        console.log(wordArr);
        gameSetup(wordArr);
    })
}
function startInsane() {
    console.log("Welcome to Insane Word Guess...\n");
    var currentWord;
    connection.query("SELECT * FROM insaneWords ORDER BY RAND() LIMIT 1", function (err, res) {
        if (err) throw err;

        for (var i = 0; i < res.length; i++) {
            console.log(typeof res[i].word);
            currentWord = res[i].word;
        }
        console.log(currentWord);
        var wordArr = currentWord.split("");
        console.log(wordArr);
        gameSetup(wordArr);
    })
}

function gameSetup(arrFromWord) {
    console.log(arrFromWord);//
    var guessingArr = [];
    for (var i = 0; i < arrFromWord.length; i++) {
        guessingArr.push("_");
    }
    console.log(guessingArr);
    gameStart(guessingArr, arrFromWord);
}


function gameStart(theGuessingArr, theWordArr) {
    console.log("Testing Purposes Only...\n");
    console.log(theGuessingArr);
    console.log(theWordArr);

    inquirer
        .prompt([
            {
                name: "guess",
                type: "input",
                message: "Please Guess a Letter",
            }
        ])
        .then(function (answer) {
            if (isAlphabet(answer.guess)) {
                if (theWordArr.includes(answer.guess.toUpperCase()) === false) {
                    console.log("Nice Try...\n");
                    lives--;
                } else {
                    for (var i = 0; i < theGuessingArr.length; i++) {
                        if (theWordArr[i] === answer.guess.toUpperCase()) {
                            theGuessingArr[i] = answer.guess.toUpperCase();
                        }
                    }
                    console.log(theGuessingArr);
                }
            } else {
                console.log("Invalid Input");
            }
        });

}

//add checker so user does not get penalized for same letter guessed twice and showcase it by appending it to an array
//showcase the lives too and finally add the repeater.