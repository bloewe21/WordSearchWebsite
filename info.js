//info script
const shareDiv = document.getElementById("sharediv");

//$(".share-btn").hide();
$("#sharediv").hide();

function shareFunction() {
    let titleText = title.textContent;
    let timeText = currentTimer.textContent;
    let foundText = "First three words: " + foundAnswers[0] + ", " + foundAnswers[1] + ", " + foundAnswers[2];
    let siteText = "https://search-daily.vercel.app/";
    navigator.clipboard.writeText(titleText + "\n" + timeText + "\n" + foundText + "\n" + siteText);
}