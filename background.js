let connection;

chrome.runtime.onInstalled.addListener(() => {
    chrome.declarativeContent.onPageChanged.removeRules(undefined, () => {
        chrome.declarativeContent.onPageChanged.addRules([{
            conditions: [new chrome.declarativeContent.PageStateMatcher({
                pageUrl: {hostEquals: 'docsend.com', pathContains: 'view'},
            })],
            actions: [new chrome.declarativeContent.ShowPageAction()]
        }]);
    });
});


chrome.pageAction.onClicked.addListener(() => {
    chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
        const currentTabId = tabs[0].id;
        chrome.tabs.executeScript(currentTabId, {file: "./modules/pdfkit.js"});
        chrome.tabs.executeScript(currentTabId, {file: "./modules/blob-stream.js"});
        chrome.tabs.executeScript(currentTabId, {file: "./src/ModifyDocSendView.js"});
        chrome.tabs.executeScript(currentTabId, {file: "./src/GeneratePDF.js"});
        chrome.tabs.executeScript(currentTabId, {file: "./src/DocSendDownloader.js"}, () => {
            connection = chrome.tabs.connect(currentTabId);
            connection.postMessage({requestType: "GENERATE_PDF"});
        })
    })
})