let connection;
let jobInProgress = false;
let jobComplete = false;

const executeJob = () => {
    jobInProgress = true;
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        const currentTabId = tabs[0].id;
        chrome.scripting.executeScript({ target: { tabId: currentTabId }, files: ["./modules/pdfkit.js"] });
        chrome.scripting.executeScript({ target: { tabId: currentTabId }, files: ["./modules/blob-stream.js"] });
        chrome.scripting.executeScript({ target: { tabId: currentTabId }, files: ["./src/ModifyDocSendView.js"] });
        chrome.scripting.executeScript({ target: { tabId: currentTabId }, files: ["./src/GeneratePDF.js"] });
        chrome.scripting.executeScript({ target: { tabId: currentTabId }, files: ["./src/DocSendDownloader.js"] }, () => {
            connection = chrome.tabs.connect(currentTabId);
            connection.postMessage({ requestType: "GENERATE_PDF" });
            connection.onMessage.addListener((message) => {
                if (message.requestType == "SET_JOB_COMPLETE") {
                    jobInProgress = false;
                    jobComplete = true;
                }
            });
        });
    });
};

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

chrome.action.onClicked.addListener(() => {
    if (jobComplete || jobInProgress) {
        try {
            connection.postMessage({ requestType: "CHECK_PROGRESS" });
        } catch {
            // Connection closed, start new job
            executeJob();
        }
    } else if (!jobInProgress && !jobComplete) {
        executeJob();
    }
});
