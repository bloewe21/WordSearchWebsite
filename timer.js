//timer script

const currentTimer = document.getElementById("currenttimer"); 
const puzzleTimer = document.getElementById("puzzletimer");

let currHours = 0;
let currMinutes = 0;
let currSeconds = 0;

document.addEventListener("DOMContentLoaded", function() {
    setSavedTimes();
    displayPuzzleTimer();
    displayCurrentTimer();
})

function setSavedTimes() {
    if (localStorage.getItem("savedCurrSeconds")) {
        currSeconds = JSON.parse(localStorage.getItem("savedCurrSeconds"));
    }
    if (localStorage.getItem("savedCurrMinutes")) {
        currMinutes = JSON.parse(localStorage.getItem("savedCurrMinutes"));
    }
    if (localStorage.getItem("savedCurrHours")) {
        currHours = JSON.parse(localStorage.getItem("savedCurrHours"));
    }
}

function displayPuzzleTimer() {
    const today = new Date();
    const hours = today.getHours();
    const minutes = today.getMinutes();
    const seconds = today.getSeconds();
    let hoursRemaining = 24 - hours - 1;
    let hoursText = hoursRemaining.toString();
    if (hoursText.length == 1) {
        hoursText = "0" + hoursText;
    }

    let minutesRemaining = 60 - minutes;
    let minutesText = minutesRemaining.toString();
    if (minutesText.length == 1) {
        minutesText = "0" + minutesText;
    }

    let secondsRemaining = 60 - seconds;
    let secondsText = secondsRemaining.toString();
    if (secondsText.length == 1) {
        secondsText = "0" + secondsText;
    }
    puzzleTimer.textContent = "Next puzzle: " + hoursText + ":" + minutesText + ":" + secondsText;
}

setInterval(displayPuzzleTimer, 1000);

function displayCurrentTimer() {
    if (finishedPuzzle) {
        clearInterval(timerInterval);
        return;
    }
    
    if (currSeconds === 60) {
        currSeconds = 0;
        currMinutes++;

        if (currMinutes === 60) {
            currMinutes = 0;
            currHours++;
        }
    }

    //set localStorage
    localStorage.setItem("savedCurrSeconds", currSeconds);
    localStorage.setItem("savedCurrMinutes", currMinutes);
    localStorage.setItem("savedCurrHours", currHours);

    let hoursText = currHours.toString();
    if (hoursText.length == 1) {
        hoursText = "0" + hoursText;
    }

    let minutesText = currMinutes.toString();
    if (minutesText.length == 1) {
        minutesText = "0" + minutesText;
    }

    let secondsText = currSeconds.toString();
    if (secondsText.length == 1) {
        secondsText = "0" + secondsText;
    }

    currentTimer.textContent = "Time: " + hoursText + ":" + minutesText + ":" + secondsText;

    currSeconds++;
}

var timerInterval = setInterval(displayCurrentTimer, 1000);