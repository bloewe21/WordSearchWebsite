//word search script

const display = document.getElementById("display");
const topdisplay = document.getElementById("topdisplay");
const keys = document.getElementById("keys");
const answerkey = document.getElementById("answerkey");
const puzzletimer = document.getElementById("puzzletimer");

//let currentPuzzle = 1;
let currentPuzzle = getCurrentPuzzle();

let letterBoard = [];
let answerBoard = [];

const buttonArray = [];
let tempButtonArray = [];

let firstClick = false;
let secondClick = false;
let firstIndex = [];
let secondIndex = [];

let highlightColor = 0;

document.addEventListener("DOMContentLoaded", function() {
    readJson();
    nextPuzzleFunction();
})

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

function generateBoard() {
    const puzzleWidth = letterBoard[0].length;
    const puzzleHeight = letterBoard.length;
    keys.style.gridTemplateColumns = "repeat(" + puzzleWidth + ", 1fr)";
    //keys.style.gridTemplateColumns = puzzleWidth;
    //console.log(keys.style.gridTemplateColumns);
    
    for (let i = 0; i < puzzleHeight; i++) {
        let row = []
        for (let j = 0; j < puzzleWidth; j++) {
            console.log(letterBoard[i]);
            const newButton = document.createElement('button');
            newButton.textContent = letterBoard[i][j];
            let myIndex = [i, j];
            newButton.dataset.myIndex = JSON.stringify(myIndex);
            newButton.setAttribute("class", "letter-btn");
            newButton.addEventListener('click', clickFunction);
            keys.appendChild(newButton);
            row.push(newButton);
        }
        buttonArray.push(row)
    }
}

function generateAnswers() {
    for (let i = 0; i < answerBoard.length; i++) {
        const answerDiv = document.createElement('div');
        answerDiv.textContent = answerBoard[i];
        answerDiv.setAttribute("class", "answerkeyword");
        answerkey.appendChild(answerDiv);
    }
}

function clickFunction() {
    if (!firstClick) {
        firstClick = true;
        firstIndex = JSON.parse(this.dataset.myIndex);
        topdisplay.textContent = "Choose your second letter.";
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
            topdisplay.textContent = "Same row";

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
            display.value = choiceString;
        }

        //same column
        else if (firstIndex[1] == secondIndex[1] && firstIndex[0] != secondIndex[0]) {
            validChoice = true;
            topdisplay.textContent = "Same column";

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
            display.value = choiceString;
        }

        //same diagonal
        else {
            let diffX = Math.abs(firstIndex[0] - secondIndex[0])
            let diffY = Math.abs(firstIndex[1] - secondIndex[1])
            if (diffX == diffY && firstIndex[0] != secondIndex[0]) {
                validChoice = true;
                topdisplay.textContent = "Same diagonal";

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
                display.value = choiceString;
            }
        }

        //check answerBoard
        if (validChoice) {
            if (answerBoard.includes(choiceString)) {
                topdisplay.textContent = "You found: " + choiceString + "!";
                tempButtonArray.forEach(button => {
                    button.setAttribute("class", "highlighted-btn");
                    let saturation = 100;
                    let lightness = 40;
                    let color = `hsl(${highlightColor}, ${saturation}%, ${lightness}%)`;
                    button.style.backgroundColor = color;
                })
                highlightColor += 30;
                for (let i = 0; i < answerkey.children.length; i++) {
                    if (answerkey.children[i].textContent == choiceString) {
                        answerkey.children[i].style.textDecoration = "line-through";
                    }
                }
            }
            else {
                topdisplay.textContent = "Incorrect!";
            }
        }

        //choice was invalid
        else {
            topdisplay.textContent = "Bad attempt";
        }

        //reset variables
        validChoice = false;
        firstClick = false;
        secondClick = false;
        firstIndex = [];
        secondIndex = [];
        tempButtonArray = [];
    }
}

function nextPuzzleFunction() {
    const today = new Date();
    const hours = today.getHours();
    const minutes = today.getMinutes();
    const seconds = today.getSeconds();
    const hoursRemaining = 24 - hours;
    const minutesRemaining = 60 - minutes;
    const secondsRemaining = 60 - seconds;
    puzzletimer.textContent = "Next puzzle: " + hoursRemaining + ":" + minutesRemaining + ":" + secondsRemaining;
}

setInterval(nextPuzzleFunction, 1000);

function getCurrentPuzzle() {
    const today = new Date();
    const firstDate = new Date('2024-12-21');
    const timeinmilisec = today.getTime() - firstDate.getTime();
    const daysPast = Math.floor(timeinmilisec / (1000 * 60 * 60 * 24));
    return daysPast;
}