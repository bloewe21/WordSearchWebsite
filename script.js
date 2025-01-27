//localStorage.clear();

//word search script

const title = document.getElementById("title");
const display = document.getElementById("display");
const topdisplay = document.getElementById("topdisplay");
const keys = document.getElementById("keys");
const answerkey = document.getElementById("answerkey");
const speechbutton = document.getElementById("texttospeech");

let currentPuzzle = getCurrentPuzzle();
title.textContent = "Search Daily #" + (currentPuzzle).toString();

let letterBoard = [];
let answerBoard = [];
let foundAnswers = [];

const buttonArray = [];
let tempButtonArray = [];

let firstClick = false;
let secondClick = false;
let firstIndex = [];
let secondIndex = [];

let answersGenerated = false;
let boardGenerated = false;
let finishedPuzzle = false;
let correctGuesses = 0;
let highlightColor = 0;

document.addEventListener("DOMContentLoaded", function() {
    readJson();
})

function getCurrentPuzzle() {
    const today = new Date();
    const firstDate = new Date('2024-12-31');
    firstDate.setHours(firstDate.getHours() + 8);
    const timeinmilisec = today.getTime() - firstDate.getTime();
    let daysPast = Math.floor(timeinmilisec / (1000 * 60 * 60 * 24));

    if (!localStorage.getItem("savedLastPuzzle")) {
        localStorage.setItem("savedLastPuzzle", daysPast);
    }

    if (daysPast != localStorage.getItem("savedLastPuzzle")) {
        localStorage.clear();
        localStorage.setItem("savedLastPuzzle", daysPast);
    }

    return daysPast;
}

function readJson() {
    fetch('./answers.json')
        .then(response => response.json())
        .then(json => {
            //make array of strings from json
            let currKey1 = Object.keys(json)[currentPuzzle];
            //if key doesnt exist
            if (!currKey1) {
                currKey1 = Object.keys(json)[1];
            }
            answerBoard = json[currKey1];
            generateAnswers();
        });

    fetch('./puzzles.json')
        .then(response => response.json())
        .then(json => {
            //make array of strings from json
            let currKey2 = Object.keys(json)[currentPuzzle];
            //if key doesnt exist
            if (!currKey2) {
                currKey2 = Object.keys(json)[1];
            }
            letterBoard = json[currKey2];
            generateBoard();
        });
}

function generateAnswers() {
    for (let i = 0; i < answerBoard.length; i++) {
        const answerDiv = document.createElement('div');
        answerDiv.textContent = answerBoard[i];
        answerDiv.setAttribute("id", "answerkeyword");
        answerkey.appendChild(answerDiv);
    }
    answersGenerated = true;
}

function generateBoard() {
    const puzzleWidth = letterBoard[0].length;
    const puzzleHeight = letterBoard.length;
    keys.style.gridTemplateColumns = "repeat(" + puzzleWidth + ", 1fr)";

    if (localStorage.getItem("savedHighlight")) {
        highlightColor = JSON.parse(localStorage.getItem("savedHighlight"));
    }
    
    for (let i = 0; i < puzzleHeight; i++) {
        let row = []
        for (let j = 0; j < puzzleWidth; j++) {
            const newButton = document.createElement('button');
            newButton.textContent = letterBoard[i][j];
            let myIndex = [i, j];
            newButton.dataset.myIndex = JSON.stringify(myIndex);
            newButton.setAttribute("class", "letter-btn");
            newButton.addEventListener('click', clickFunction);

            //set custom button attributes
            newButton.setAttribute("row", i);
            newButton.setAttribute("column", j);

            let saturation = 100;
            let lightness = 40;
            if (localStorage.getItem("savedButtonHighlight" + i + "column" + j)) {
                let highlightColor = JSON.parse(localStorage.getItem("savedButtonHighlight" + i + "column" + j));
                let color = `hsl(${highlightColor}, ${saturation}%, ${lightness}%)`;
                newButton.style.backgroundColor = color;
                newButton.setAttribute("class", "highlighted-btn");
            }

            keys.appendChild(newButton);
            row.push(newButton);
        }
        buttonArray.push(row)
    }
    boardGenerated = true;
}

var checkInterval = setInterval(checkSavedFunction, 50);

function checkSavedFunction() {
    if (answersGenerated && boardGenerated) {
        clearInterval(checkInterval);
    }
    else {
        return;
    }

    if (localStorage.getItem("savedCorrectGuesses")) {
        correctGuesses = JSON.parse(localStorage.getItem("savedCorrectGuesses"));
    }

    if (correctGuesses == answerBoard.length) {
        //$(".share-btn").fadeIn();
        $("#sharediv").fadeIn(2000);
        topdisplay.textContent = "Puzzle complete!";
    }

    if (localStorage.getItem("savedFinishedPuzzle")) {
        finishedPuzzle = true;
    }

    let savedFoundAnswers = JSON.parse(localStorage.getItem("savedFoundAnswers"));
    if (savedFoundAnswers) {
        foundAnswers = savedFoundAnswers;
        for (let i = 0; i < savedFoundAnswers.length; i++) {
            for (let j = 0; j < answerkey.children.length; j++) {
                if (savedFoundAnswers[i] == answerkey.children[j].textContent) {
                    answerkey.children[j].style.textDecoration = "line-through";
                    answerkey.children[j].style.color = "red";
                    answerkey.children[j].style.fontWeight = "bold";
                }
            }
        }
    }
}

function clickFunction() {
    if (!firstClick) {
        firstClick = true;
        firstIndex = JSON.parse(this.dataset.myIndex);
        let firstButton = buttonArray[firstIndex[0]][firstIndex[1]];
        firstButton.setAttribute("id", "indented-btn");
        topdisplay.textContent = "Choose an ending letter...";
    }
    else if (!secondClick) {
        secondClick = true;
        secondIndex = JSON.parse(this.dataset.myIndex);

        let validChoice = false;
        let choiceString = "";

        //check for validity
        //same row
        if (firstIndex[0] == secondIndex[0] && firstIndex[1] != secondIndex[1]) {
            validChoice = true;

            //left to right
            if (firstIndex[1] < secondIndex[1]) {
                for (let i = firstIndex[1]; i <= secondIndex[1]; i++) {
                    choiceString += letterBoard[firstIndex[0]][i];
                    tempButtonArray.push(buttonArray[firstIndex[0]][i]);
                }
            }
            //right to left
            else if (firstIndex[1] > secondIndex[1]) {
                for (let i = firstIndex[1]; i >= secondIndex[1]; i--) {
                    choiceString += letterBoard[firstIndex[0]][i];
                    tempButtonArray.push(buttonArray[firstIndex[0]][i]);
                }
            }
        }

        //same column
        else if (firstIndex[1] == secondIndex[1] && firstIndex[0] != secondIndex[0]) {
            validChoice = true;

            //top to bottom
            if (firstIndex[0] < secondIndex[0]) {
                for (let i = firstIndex[0]; i <= secondIndex[0]; i++) {
                    choiceString += letterBoard[i][firstIndex[1]];
                    tempButtonArray.push(buttonArray[i][firstIndex[1]]);
                }
            }
            //bottom to top
            else if (firstIndex[0] > secondIndex[0]) {
                for (let i = firstIndex[0]; i >= secondIndex[0]; i--) {
                    choiceString += letterBoard[i][firstIndex[1]];
                    tempButtonArray.push(buttonArray[i][firstIndex[1]]);
                }
            }
        }

        //same diagonal
        else {
            let diffX = Math.abs(firstIndex[0] - secondIndex[0])
            let diffY = Math.abs(firstIndex[1] - secondIndex[1])
            if (diffX == diffY && firstIndex[0] != secondIndex[0]) {
                validChoice = true;

                //down right
                if (firstIndex[0] < secondIndex[0] && firstIndex[1] < secondIndex[1])
                {
                    for (let i = 0; i <= secondIndex[1] - firstIndex[1]; i++) {
                        choiceString += letterBoard[firstIndex[0] + i][firstIndex[1] + i];
                        tempButtonArray.push(buttonArray[firstIndex[0] + i][firstIndex[1] + i]);
                    }
                }
                //up right
                else if (firstIndex[0] > secondIndex[0] && firstIndex[1] < secondIndex[1]) {
                    for (let i = 0; i <= secondIndex[1] - firstIndex[1]; i++) {
                        choiceString += letterBoard[firstIndex[0] - i][firstIndex[1] + i];
                        tempButtonArray.push(buttonArray[firstIndex[0] - i][firstIndex[1] + i]);
                    }
                }
                //down left
                else if (firstIndex[0] < secondIndex[0] && firstIndex[1] > secondIndex[1]) {
                    for (let i = 0; i <= firstIndex[1] - secondIndex[1]; i++) {
                        choiceString += letterBoard[firstIndex[0] + i][firstIndex[1] - i];
                        tempButtonArray.push(buttonArray[firstIndex[0] + i][firstIndex[1] - i]);
                    }
                }
                //up left
                else if (firstIndex[0] > secondIndex[0] && firstIndex[1] > secondIndex[1]) {
                    for (let i = 0; i <= firstIndex[1] - secondIndex[1]; i++) {
                        choiceString += letterBoard[firstIndex[0] - i][firstIndex[1] - i];
                        tempButtonArray.push(buttonArray[firstIndex[0] - i][firstIndex[1] - i]);
                    }
                }
            }
        }

        //check answerBoard
        if (validChoice) {
            var speechMsg = new SpeechSynthesisUtterance();
            speechMsg.text = choiceString;
            if (speechbutton.checked) {
                window.speechSynthesis.speak(speechMsg);
            }

            if (foundAnswers.includes(choiceString)) {
                topdisplay.textContent = "Already found";
                validChoice = false;
                resetPuzzleVariables();
                return;
            }
            if (answerBoard.includes(choiceString)) {
                correctGuesses += 1;
                foundAnswers.push(choiceString);
                localStorage.setItem("savedFoundAnswers", JSON.stringify(foundAnswers));
                localStorage.setItem("savedCorrectGuesses", correctGuesses);
                topdisplay.textContent = "Found: " + choiceString;

                if (correctGuesses == answerBoard.length) {
                    //$(".share-btn").fadeIn();
                    $("#sharediv").fadeIn(2000);
                    topdisplay.textContent = "Puzzle complete!";
                    start();
                    stop();
                    finishedPuzzle = true;
                    localStorage.setItem("savedFinishedPuzzle", finishedPuzzle);
                }
                
                tempButtonArray.forEach(button => {
                    button.setAttribute("class", "highlighted-btn");
                    let saturation = 100;
                    let lightness = 40;
                    let color = `hsl(${highlightColor}, ${saturation}%, ${lightness}%)`;
                    button.style.backgroundColor = color;
                    localStorage.setItem("savedButtonHighlight" + button.getAttribute("row") + "column" + button.getAttribute("column"), highlightColor);
                })
                highlightColor += 30;
                localStorage.setItem("savedHighlight", highlightColor);
                
                for (let i = 0; i < answerkey.children.length; i++) {
                    if (answerkey.children[i].textContent == choiceString) {
                        answerkey.children[i].style.textDecoration = "line-through";
                        answerkey.children[i].style.color = "red";
                        answerkey.children[i].style.fontWeight = "bold";
                    }
                }
            }
            else {
                topdisplay.textContent = "Not found: " + choiceString;
            }
        }

        //choice was invalid
        else {
            topdisplay.textContent = "Invalid attempt";
        }

        //reset variables
        validChoice = false;
        resetPuzzleVariables();
    }
}

function resetPuzzleVariables() {
    let firstButton = buttonArray[firstIndex[0]][firstIndex[1]];
    firstButton.setAttribute("id", "");
    firstClick = false;
    secondClick = false;
    firstIndex = [];
    secondIndex = [];
    tempButtonArray = [];

    setTimeout(() => {
        if (!firstClick) {
            if (finishedPuzzle) {
                topdisplay.textContent = "Puzzle complete!";
            }
            else {
                topdisplay.textContent = "Choose a starting letter...";
            }
        }
    }, 2000);
}

const start = () => {
    setTimeout(function() {
        confetti.start()
    }, 1000);
};

//  for stopping the confetti 

const stop = () => {
    setTimeout(function() {
        confetti.stop()
    }, 5000);
};