//info script
const shareDiv = document.getElementById("sharediv");
const infoForm = document.getElementById("info");

//$(".share-btn").hide();
$("#sharediv").hide();
infoForm.style.visibility = "hidden";

function shareFunction() {
    let titleText = title.textContent;
    let timeText = currentTimer.textContent;
    let foundText = "First three words: " + foundAnswers[0] + ", " + foundAnswers[1] + ", " + foundAnswers[2];
    let siteText = "https://search-daily.vercel.app/";
    navigator.clipboard.writeText(titleText + "\n" + timeText + "\n" + foundText + "\n" + siteText);
}

function openInfo() {
    if (window.innerWidth < 1300) {
        return;
    }
    if (infoForm.style.visibility === "hidden") {
        infoForm.style.visibility = "visible";
      } else {
        infoForm.style.visibility = "hidden";
      }
}

function onWindowSize() {
    if (window.innerWidth < 1300) {
        infoForm.style.visibility = "hidden";
    }
  }
  
window.onresize = onWindowSize;