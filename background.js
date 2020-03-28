let connection;

let sendGetSlideImagesRequest = () => {
    connection.postMessage({requestType: "GET_SLIDE_IMAGES"});
}

chrome.runtime.onInstalled.addListener(() => {
    chrome.declarativeContent.onPageChanged.removeRules(undefined, () => {
        chrome.declarativeContent.onPageChanged.addRules([{
            conditions: [new chrome.declarativeContent.PageStateMatcher({
                pageUrl: {hostEquals: 'docsend.com'},
            })],
            actions: [new chrome.declarativeContent.ShowPageAction()]
        }]);
    });
});


chrome.pageAction.onClicked.addListener(() => {
    chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
        chrome.tabs.executeScript(tabs[0].id, {file: "DocSendDownloader.js"}, () => {
            connection = chrome.tabs.connect(tabs[0].id);
            sendGetSlideImagesRequest();  
        })
    })
})