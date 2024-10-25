document.addEventListener("mouseup", (event) => {
    const selectedText = window.getSelection().toString().trim();
    if (selectedText) {
        chrome.runtime.sendMessage({ action: "translateText", text: selectedText }, (response) => {
            if (response) {
                if (response.success) {
                    showTooltip(event.pageX, event.pageY, response.translation); // 只传递翻译后的内容
                } else {
                    console.error(response.error);
                }
            } else {
                console.error("No response received.");
            }
        });
    }
});

let tooltip; // Store the tooltip element globally

function showTooltip(x, y, translation) {
    // 如果已经有气泡存在，先移除旧的
    if (tooltip) {
        document.body.removeChild(tooltip);
    }

    tooltip = document.createElement("div");
    tooltip.style.position = "absolute";
    tooltip.style.backgroundColor = "#000"; // 黑色背景
    tooltip.style.color = "#fff"; // 白色文字
    tooltip.style.border = "1px solid #ccc";
    tooltip.style.padding = "10px";
    tooltip.style.zIndex = "9999";
    tooltip.style.left = `${x}px`;
    tooltip.style.top = `${y}px`;
    tooltip.style.boxShadow = "0 0 10px rgba(0,0,0,0.2)";
    tooltip.style.borderRadius = "5px";
    tooltip.style.fontSize = "14px";
    tooltip.style.maxWidth = "300px";
    tooltip.style.wordWrap = "break-word";

    tooltip.textContent = translation; // 只显示翻译后的内容

    document.body.appendChild(tooltip);

    // 添加鼠标点击事件监听器，在下次点击时移除气泡
    document.addEventListener("click", removeTooltipOnClick);
}

function removeTooltipOnClick() {
    if (tooltip) {
        document.body.removeChild(tooltip);
        tooltip = null; // 清除气泡的引用
    }
    document.removeEventListener("click", removeTooltipOnClick); // 移除点击事件监听器
}
