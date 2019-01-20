var mysql = require("mysql");
var inquirer = require("inquirer");
var totalWins = 0;
var totalLosses = 0;
var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "root12345",
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
var alreadyGuessed = [];

function startWordGuess() {
    console.log("Welcome to Word Guess! Please Select A Difficulty...\n");
    inquirer
        .prompt([{
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
        // console.log(currentWord);
        var wordArr = currentWord.split("");
        // console.log(wordArr);
        console.log("The Catergory will be Common Animals...\n")
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
        // console.log(currentWord);
        var wordArr = currentWord.split("");
        // console.log(wordArr);
        console.log("The Catergory will be Common Desserts...\n");
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
        // console.log(currentWord);
        var wordArr = currentWord.split("");
        // console.log(wordArr);
        console.log("The Catergory will be Common Insects...\n")
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
        // console.log(currentWord);
        var wordArr = currentWord.split("");
        // console.log(wordArr);
        console.log("The Catergory will be Common Disorders and Disabilities...\n")
        gameSetup(wordArr);
    })
}

function gameSetup(arrFromWord) {
    // console.log(arrFromWord);//
    var guessingArr = [];
    for (var i = 0; i < arrFromWord.length; i++) {
        guessingArr.push("_");
    }
    console.log(guessingArr);
    gameStart(guessingArr, arrFromWord);
}


function gameStart(theGuessingArr, theWordArr) {

    if (lives === 0 || lives < 0) {
        console.log(`You Have Lost the game...\n`);
        totalLosses++;
        return gameOver();
    }

    if (!theGuessingArr.includes("_")) {
        console.log("You Win! Goodjob...\n");
        totalWins++;
        return gameOver();
    }

    // console.log("Testing Purposes Only...\n");
    // console.log(theGuessingArr);
    // console.log(theWordArr);

    inquirer
        .prompt([{
            name: "guess",
            type: "input",
            message: "Please Guess a Letter",
        }])
        .then(function (answer) {
            if (isAlphabet(answer.guess)) {
                if (theWordArr.includes(answer.guess.toUpperCase()) === false) {
                    if (alreadyGuessed.includes(answer.guess.toUpperCase()) === true) {
                        console.log("You already guessed this letter, No lives Deducted...\n");
                        return gameStart(theGuessingArr, theWordArr);
                    }
                    console.log("Nice Try...\n");
                    alreadyGuessed.push(answer.guess.toUpperCase());
                    console.log(`You have Guessed the following: ${alreadyGuessed}`);
                    lives--;
                    console.log(`You have ${lives} lives left`);
                    gameStart(theGuessingArr, theWordArr)
                } else {
                    for (var i = 0; i < theGuessingArr.length; i++) {
                        if (theWordArr[i] === answer.guess.toUpperCase()) {
                            theGuessingArr[i] = answer.guess.toUpperCase();
                        }
                    }
                    console.log(`You have Guessed the following: ${alreadyGuessed}`);
                    console.log(theGuessingArr);
                    gameStart(theGuessingArr, theWordArr)
                }
            } else {
                console.log(`Invalid Input, No Lives were Deducted...\n You have ${lives} left`);
                gameStart(theGuessingArr, theWordArr);
            }
        });
}

function gameOver() {

    inquirer
        .prompt([{
            name: "playAgain",
            type: "rawlist",
            message: "Would You Like to Play Again",
            choices: ["YES", "NO"]
        }]).then(function (answer) {
            if (answer.playAgain === "YES") {
                startWordGuess();
                connection.end();
                console.log(`Total Wins: ${totalWins}`);
                console.log(`Total Losses: ${totalLosses}...\n`);
            } else {
                console.log(`Total Wins: ${totalWins}`);
                console.log(`Total Losses: ${totalLosses}...\n`);

                console.log("Thank You for Playing!...\n");
                connection.end();
            }
        })
}