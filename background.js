let connection;
let jobInProgress = false;
let jobComplete = false;

const executeJob = () => {
    jobInProgress = true;
    chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
        const currentTabId = tabs[0].id;
        chrome.tabs.executeScript(currentTabId, {file: "./modules/pdfkit.js"});
        chrome.tabs.executeScript(currentTabId, {file: "./modules/blob-stream.js"});
        chrome.tabs.executeScript(currentTabId, {file: "./src/ModifyDocSendView.js"});
        chrome.tabs.executeScript(currentTabId, {file: "./src/GeneratePDF.js"});
        chrome.tabs.executeScript(currentTabId, {file: "./src/DocSendDownloader.js"}, () => {
            connection = chrome.tabs.connect(currentTabId);
            connection.postMessage({requestType: "GENERATE_PDF"});
            connection.onMessage.addListener((message) => {
                if (message.requestType == "SET_JOB_COMPLETE") {
                    jobInProgress = false;
                    jobComplete = true;
                }
            })
        })
    })
}

chrome.runtime.onInstalled.addListener(() => {
    chrome.declarativeContent.onPageChanged.removeRules(undefined, () => {
        chrome.declarativeContent.onPageChanged.addRules([{
            conditions: [new chrome.declarativeContent.PageStateMatcher({
                pageUrl: {hostSuffix: 'docsend.com', pathContains: 'view'},
            })],
            actions: [new chrome.declarativeContent.ShowPageAction()]
        }]);
    });
});


chrome.pageAction.onClicked.addListener(() => {
    
    chrome.webRequest.onHeadersReceived.addListener(
        function(response) {
            response.responseHeaders.push({'name': "Access-Control-Allow-Origin", 'value': "*"});
            response.responseHeaders.push({'name': "Access-Control-Allow-Methods", 'value': "GET, OPTIONS"});
            return {responseHeaders: response.responseHeaders}
        },
        {
            urls: ["https://*.docsend.com/*", "https://*.cloudfront.net/*"]
        },
        ["blocking", "responseHeaders", "extraHeaders"]
    )

    if (jobComplete || jobInProgress) {
        try {
            connection.postMessage({requestType: "CHECK_PROGRESS"});
        } 
        catch {
            //Connection closed, start new job
            executeJob();
        }
    }
    else if (!jobInProgress && !jobComplete) {
        executeJob();
    }
})