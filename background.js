chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === "translateText") {
        const url = `https://findmyip.net/api/translate.php?text=${encodeURIComponent(request.text)}`;

        fetch(url)
            .then(response => {
                if (!response.ok) {
                    throw new Error("Network response was not ok");
                }
                return response.json();
            })
            .then(data => {
                if (data.code === 200) {
                    sendResponse({ success: true, translation: data.data.translate_result });
                } else {
                    sendResponse({ success: false, error: "Translation failed" });
                }
            })
            .catch(error => {
                sendResponse({ success: false, error: error.message });
            });
        return true; // Indicates that response will be sent asynchronously
    }
});
