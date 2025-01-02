//word search script

const title = document.getElementById("title");
const display = document.getElementById("display");
const topdisplay = document.getElementById("topdisplay");
const keys = document.getElementById("keys");
const answerkey = document.getElementById("answerkey");

//let currentPuzzle = 1;
let currentPuzzle = getCurrentPuzzle();
title.textContent = "Daily Word Search #" + (currentPuzzle + 1).toString();

let letterBoard = [];
let answerBoard = [];
let foundButtons = [];
let foundAnswers = [];

const buttonArray = [];
let tempButtonArray = [];

let firstClick = false;
let secondClick = false;
let firstIndex = [];
let secondIndex = [];

let finishedPuzzle = false;
let correctGuesses = 0;
let highlightColor = 0;

document.addEventListener("DOMContentLoaded", function() {
    readJson();
})

//localStorage.clear();

function getCurrentPuzzle() {
    const today = new Date();
    const firstDate = new Date('2025-01-01');
    const timeinmilisec = today.getTime() - firstDate.getTime();
    const daysPast = Math.floor(timeinmilisec / (1000 * 60 * 60 * 24));
    return daysPast;
}

function readJson() {
    fetch('./answers.json')
        .then(response => response.json())
        .then(json => {
            //make array of strings from json
            const currKey1 = Object.keys(json)[currentPuzzle];
            answerBoard = json[currKey1];
            generateAnswers();
        });

    fetch('./puzzles.json')
        .then(response => response.json())
        .then(json => {
            //make array of strings from json
            const currKey2 = Object.keys(json)[currentPuzzle];
            letterBoard = json[currKey2];
            generateBoard();
        });
}

function generateAnswers() {
    for (let i = 0; i < answerBoard.length; i++) {
        const answerDiv = document.createElement('div');
        answerDiv.textContent = answerBoard[i];
        answerDiv.setAttribute("class", "answerkeyword");
        answerkey.appendChild(answerDiv);
    }
    console.log("answer");
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
            if (localStorage.getItem("savedButtonHighlight" + i + j)) {
                let highlightColor = JSON.parse(localStorage.getItem("savedButtonHighlight" + i + j));
                let color = `hsl(${highlightColor}, ${saturation}%, ${lightness}%)`;
                newButton.style.backgroundColor = color;
                newButton.setAttribute("class", "highlighted-btn");
            }

            keys.appendChild(newButton);
            row.push(newButton);
        }
        buttonArray.push(row)
    }
    console.log("board");
    checkSavedFunction();
}

function checkSavedFunction() {
    console.log("saved");

    if (localStorage.getItem("savedCorrectGuesses")) {
        correctGuesses = JSON.parse(localStorage.getItem("savedCorrectGuesses"));
    }

    if (correctGuesses == answerBoard.length) {
        topdisplay.textContent = "CONGRATS!";
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
    console.log(savedFoundAnswers);
}

function clickFunction() {
    if (!firstClick) {
        firstClick = true;
        firstIndex = JSON.parse(this.dataset.myIndex);
        //topdisplay.textContent = "Choose your second letter.";
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
            //topdisplay.textContent = "Same row";

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
            //display.value = choiceString;
        }

        //same column
        else if (firstIndex[1] == secondIndex[1] && firstIndex[0] != secondIndex[0]) {
            validChoice = true;
            //topdisplay.textContent = "Same column";

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
            //display.value = choiceString;
        }

        //same diagonal
        else {
            let diffX = Math.abs(firstIndex[0] - secondIndex[0])
            let diffY = Math.abs(firstIndex[1] - secondIndex[1])
            if (diffX == diffY && firstIndex[0] != secondIndex[0]) {
                validChoice = true;
                //topdisplay.textContent = "Same diagonal";

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
                //display.value = choiceString;
            }
        }

        //check answerBoard
        if (validChoice) {
            if (foundAnswers.includes(choiceString)) {
                topdisplay.textContent = "Already found";
                validChoice = false;
                resetPuzzleVariables();
                return;
            }
            else {
                foundAnswers.push(choiceString);
                localStorage.setItem("savedFoundAnswers", JSON.stringify(foundAnswers));
            }
            if (answerBoard.includes(choiceString)) {
                correctGuesses += 1;
                localStorage.setItem("savedCorrectGuesses", correctGuesses);
                topdisplay.textContent = "Found: " + choiceString;

                if (correctGuesses == answerBoard.length) {
                    topdisplay.textContent = "CONGRATS!";
                    finishedPuzzle = true;
                    localStorage.setItem("savedFinishedPuzzle", finishedPuzzle);
                }
                
                // localStorage.removeItem("savedButtonArray");
                // localStorage.setItem("savedButtonArray", JSON.stringify(tempButtonArray));
                tempButtonArray.forEach(button => {
                    button.setAttribute("class", "highlighted-btn");
                    let saturation = 100;
                    let lightness = 40;
                    let color = `hsl(${highlightColor}, ${saturation}%, ${lightness}%)`;
                    button.style.backgroundColor = color;
                    localStorage.setItem("savedButtonHighlight" + button.getAttribute("row") + button.getAttribute("column"), highlightColor);
                })
                console.log(highlightColor);
                highlightColor += 30;
                localStorage.setItem("savedHighlight", highlightColor);
                // let testword = JSON.parse(localStorage.getItem("savedButtonArray"));
                // console.log(tempButtonArray);
                // console.log(testword);
                
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
    firstClick = false;
    secondClick = false;
    firstIndex = [];
    secondIndex = [];
    tempButtonArray = [];
}