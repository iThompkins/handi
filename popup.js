const peer = new Peer();
const peerIdDiv = document.getElementById("peerid");
const statusDiv = document.getElementById("status");
const qrCanvas = document.getElementById("qr");

// When peer is ready, show QR code
peer.on("open", (id) => {
  peerIdDiv.innerText = "Peer ID: " + id;
  const mobileUrl = `${window.location.origin}/mobile.html?peer=${id}`;
  QRCode.toCanvas(qrCanvas, mobileUrl, { width: 256 });
  statusDiv.innerText = "Waiting for phone to connect...";
});

// Handle incoming connection
peer.on("connection", (conn) => {
  statusDiv.innerText = "Phone connected!";
  conn.on("data", (data) => {
    // Expect data to be { type: "image"|"video", data: base64 }
    if (data.type === "image") {
      copyImageToClipboard(data.data);
      sendImageToContentScript(data.data);
      statusDiv.innerText = "Image pasted!";
    } else if (data.type === "video") {
      // For video, copy to clipboard not universally supported, fallback to input
      sendVideoToContentScript(data.data);
      statusDiv.innerText = "Video pasted!";
    }
  });
});

// Clipboard helper (Image)
async function copyImageToClipboard(base64) {
  const blob = await (await fetch(base64)).blob();
  await navigator.clipboard.write([
    new ClipboardItem({ [blob.type]: blob })
  ]);
}

// Send to content script to populate input
function sendImageToContentScript(base64) {
  chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
    chrome.tabs.sendMessage(tabs[0].id, {type: "image", data: base64});
  });
}
function sendVideoToContentScript(base64) {
  chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
    chrome.tabs.sendMessage(tabs[0].id, {type: "video", data: base64});
  });
}

