//info script
const shareDiv = document.getElementById("sharediv");

function infoFunction() {
    let titleText = title.textContent;
    let timeText = currentTimer.textContent;
    let foundText = "First three words: " + foundAnswers[0] + ", " + foundAnswers[1] + ", " + foundAnswers[2];
    let siteText = "insert site here";
    navigator.clipboard.writeText(titleText + "\n" + timeText + "\n" + foundText + "\n" + siteText);
}

function createShare() {
    const shareButton = document.createElement('button');
    shareButton.setAttribute("class", "share-btn");
    shareButton.textContent = "Share";
    shareButton.addEventListener('click', infoFunction);
    shareDiv.appendChild(shareButton);
}

//const shareButton = document.createElement('button');