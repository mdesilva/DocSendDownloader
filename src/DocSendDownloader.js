let connection;
let numSlides = parseInt((document.getElementsByClassName("page-label")[0].innerHTML).split(" ")[0]);
let baseUrl = window.location.href;
let metadataEndpoint = baseUrl.charAt(baseUrl.length-1) == "/" ? baseUrl + "page_data/" : baseUrl + "/page_data/";
let slideImageUrls = [];

let slideDeckAlreadyDownloaded = false; //cannot download the slide deck more than once on the same session
let slideDeckGenerationInProgress = false;

let userIsAuthenticated = () => {
    //If prompt doesn't exist, user has entered their email address to access slide deck.
    if (document.getElementById("prompt") == null) {
        return true; 
    } else {
        return false;
    }
}

let getSlideImageUrls = async () => {
    for(let i=1; i<=numSlides; i++) {
        let url = metadataEndpoint + String(i);
        await fetch(url)
        .then((response) => {
            return response.json();
        })
        .then((data) => {
            slideImageUrls.push(data.imageUrl);
        })
    }
}

let generateSlideDeckPdf = async () => {
    await getSlideImageUrls();
    buildPdf(slideImageUrls);
}

chrome.runtime.onConnect.addListener((port) => {
    connection = port;
    port.onMessage.addListener((message) => {
        if (userIsAuthenticated()) {
            if (message.requestType == "GENERATE_PDF") {
                slideDeckGenerationInProgress = true;
                slideDeckAlreadyDownloaded = true;
                showCustomAlert("Generating slide deck as PDF...");
                generateSlideDeckPdf();
            } 
            else if (message.requestType == "CHECK_PROGRESS") {
                if (slideDeckGenerationInProgress) {
                    showCustomAlert("Please wait. Still generating slide deck as PDF...");
                }
                else if (slideDeckAlreadyDownloaded) {
                    showDefaultAlert("Slide deck was already downloaded during this session. Please reload the page to download again.")
                } else {
                    showDefaultAlert("ERROR: Slide deck download progress unknown. Please try again.");
                }
            }
        } else {
            showDefaultAlert("You must be signed in to download this slide deck as a PDF.")
        }
    })
})


stream.on("finish", () => {
    slideDeckGenerationInProgress = false;
    let blobUrl = stream.toBlobURL('application/pdf');
    let totalTime = new Date().getTime() - startTime;
    initiateDownload(blobUrl);
    hideCustomAlert();
    showDefaultAlert("Done ! Slide deck PDF generated in " + String(totalTime) + " ms.");
    connection.postMessage({requestType: "SET_JOB_COMPLETE"});
})