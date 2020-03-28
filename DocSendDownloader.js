let numSlides = parseInt((document.getElementsByClassName("page-label")[0].innerHTML).split(" ")[0]);
let endpoint = window.location.href + "page_data/";

let getSlideImages = async () => {
    for(let i=1; i<=numSlides; i++) {
    let url = endpoint + String(i);
    await fetch(url)
    .then((response) => {
        return response.json();
    })
    .then((data) => {
        console.log(i);
    })
    }
}

chrome.runtime.onConnect.addListener((port) => {
    port.onMessage.addListener((message) => {
        if (message.requestType = "GET_SLIDE_IMAGES") {
            getSlideImages();
        }
    })
})