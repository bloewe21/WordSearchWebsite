//info script
const shareDiv = document.getElementById("sharediv");

function shareFunction() {
    let titleText = title.textContent;
    let timeText = currentTimer.textContent;
    let foundText = "First three words: " + foundAnswers[0] + ", " + foundAnswers[1] + ", " + foundAnswers[2];
    let siteText = "https://word-search-website.vercel.app/";
    navigator.clipboard.writeText(titleText + "\n" + timeText + "\n" + foundText + "\n" + siteText);
}

function createShare() {
    const shareButton = document.createElement('button');
    shareButton.setAttribute("class", "share-btn");
    shareButton.textContent = "Share";
    shareButton.addEventListener('click', shareFunction);
    shareDiv.appendChild(shareButton);
}