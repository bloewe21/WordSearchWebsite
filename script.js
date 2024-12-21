//calculator script

const display = document.getElementById("display");
const topdisplay = document.getElementById("topdisplay");
const keys = document.getElementById("keys");

// let letterBoard = ["TGUSEARCHN",
//     "JMLRIXTNQB",
//     "GGRILTMNXA",
//     "NHESYUOAEC",
//     "CLEQTNCNCR",
//     "UOPUZZLEMY",
//     "AAAADLUPSI",
//     "WAARTLRCES",
//     "NONEQESLIM",
//     "NCAHNORTPQ"];

let letterBoard = [];
let answerBoard = [];

// const answerBoard = ["PUZZLE",
//     "PEER",
//     "REEP",
//     "RENTA",
//     "ELZZUP"];

document.addEventListener("DOMContentLoaded", function() {
    readJson();
})

let currentPuzzle = 1;
let firstClick = false;
let secondClick = false;
let firstIndex = [];
let secondIndex = [];
const buttonArray = [];
let tempButtonArray = []

function readJson() {
    fetch('./answers.json')
        .then(response => response.json())
        .then(json => {
            const currKey1 = Object.keys(json)[currentPuzzle];
            //console.log(currKey);
            //console.log(json[currKey]);
            answerBoard = json[currKey1];
            console.log(answerBoard);

            generateAnswers();
        });

    fetch('./puzzles.json')
        .then(response => response.json())
        .then(json => {
            const currKey2 = Object.keys(json)[currentPuzzle];
            //console.log(currKey);
            //console.log(json[currKey]);
            letterBoard = json[currKey2];
            console.log(letterBoard);
            
            generateBoard();
        });
}

function generateBoard() {
    for (let i = 0; i < 10; i++) {
        let row = []
        for (let j = 0; j < 10; j++) {
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
        const newDiv = document.createElement('div');
        newDiv.textContent = answerBoard[i];
        newDiv.setAttribute("class", "answerkey")
        document.body.appendChild(newDiv)
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
                    button.style.color = 'orange';
                })
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