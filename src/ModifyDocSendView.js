// Get the pre-existing alert container elements. Default alerts fade after some pre-defined time.
let defaultAlertContainer = document.getElementsByClassName("row flash flash-notice")[0];
let defaultAlertTextElement = document.getElementsByClassName("alert_content alert_content--with-close")[0];

// Intialize a custom alert container. These alerts do not fade.
let customAlertContainer = document.createElement("div");
let customAlertContainerText = document.createElement("div");

customAlertContainer.className = "row alert alert-info";
customAlertContainer.style = "display: none;"
customAlertContainerText.className = "alert_content";
customAlertContainerText.style = "display: flex;flex-direction: row;justify-content: center;align-items: center;";

customAlertContainer.appendChild(customAlertContainerText);
document.body.insertBefore(customAlertContainer, document.body.firstChild);

let loadingIconSVG = '<?xml version="1.0" encoding="utf-8"?><svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" style="margin-right: 1rem; background: none; shape-rendering: auto; animation-play-state: running; animation-delay: 0s;" width="50px" height="50px" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid"><circle cx="50" cy="50" fill="none" stroke="#5b8be1" stroke-width="10" r="35" stroke-dasharray="164.93361431346415 56.97787143782138" style="animation-play-state: running; animation-delay: 0s;" transform="rotate(303.026 50 50)"><animateTransform attributeName="transform" type="rotate" repeatCount="indefinite" dur="1s" values="0 50 50;360 50 50" keyTimes="0;1" style="animation-play-state: running; animation-delay: 0s;"></animateTransform></circle>';

let initiateDownload = (url) => {
    const filename = document.getElementsByClassName("contact-card_description").length === 1 ? document.getElementsByClassName("contact-card_description")[0].innerText.substring(1, document.getElementsByClassName("contact-card_description")[0].innerText.length-1) + " Deck" : document.getElementsByClassName("contact-card_email").length === 1 ? document.getElementsByClassName("contact-card_email")[0].href.split("@")[1].split(".")[0] + " deck" : "slidedeck";
    let downloadLink = document.createElement('a');
    downloadLink.href = url;
    downloadLink.setAttribute('download', `${filename}.pdf`);
    downloadLink.click();
}


let showDefaultAlert = (message) => {
    defaultAlertTextElement.innerHTML = message;
    defaultAlertContainer.setAttribute("style", "display:block;");
}


let showCustomAlert = (message) => {
    customAlertContainerText.innerHTML = message;
    customAlertContainer.style = "display: block; padding: 10px; margin-bottom: 0px;";
}

let hideDefaultAlert = () => {
    defaultAlertTextElement.innerHTML = "";
    defaultAlertContainer.setAttribute("style", "display:none;");
}

let hideCustomAlert = () => {
    customAlertContainer.style = "display: none;";
}
