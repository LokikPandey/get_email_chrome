let scrapemail = document.getElementById('scrapemail');
let emaillist = document.getElementById('abc');

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    emaillist.innerHTML = '';

    let emails = request.emails;

    if (emails == null || emails.length == 0) {
        let li = document.createElement('li');
        li.innerText = 'No Emails Found';
        emaillist.appendChild(li);
    } else {
        for (let i = 0; i < emails.length; i++) {
            let li = document.createElement('li');
            li.innerText = emails[i];
            li.addEventListener('click', function() {
                navigator.clipboard.writeText(li.innerText);
                alert('Email copied');
            });
            emaillist.appendChild(li);
        }
    }
});

scrapemail.addEventListener('click', async function () {
    let [tab] = await chrome.tabs.query({
        active: true,
        currentWindow: true
    });

    if (tab.url.startsWith('http://') || tab.url.startsWith('https://')) {
        chrome.scripting.executeScript({
            target: { tabId: tab.id },
            function: scrapEmailfromPage,
        });
    } else {
        alert('This script cannot run on this page.');
    }
});

function scrapEmailfromPage() {
    const emailregex = /\b[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}\b/g;
    let emails = document.body.innerHTML.match(emailregex);

    chrome.runtime.sendMessage({ emails });
}