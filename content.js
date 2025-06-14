// Listen for messages from popup
chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  if (msg.type === "image") {
    insertImageToInput(msg.data);
  } else if (msg.type === "video") {
    insertVideoToInput(msg.data);
  }
});

// Helper to find focused input/textarea/contenteditable and insert image
function insertImageToInput(base64) {
  let active = document.activeElement;
  if (active && (active.tagName === "TEXTAREA" || active.tagName === "INPUT")) {
    // Insert markdown image for demo
    active.value += `![image](data:image/png;base64,${base64.split(',')[1]})`;
  } else {
    // Else, try to insert in contenteditable
    let editable = document.querySelector('[contenteditable="true"]');
    if (editable) {
      let img = document.createElement("img");
      img.src = base64;
      editable.appendChild(img);
    }
  }
}

// Helper for video (as link)
function insertVideoToInput(base64) {
  let active = document.activeElement;
  if (active && (active.tagName === "TEXTAREA" || active.tagName === "INPUT")) {
    active.value += ` [video](data:video/webm;base64,${base64.split(',')[1]})`;
  } else {
    let editable = document.querySelector('[contenteditable="true"]');
    if (editable) {
      let video = document.createElement("video");
      video.src = base64;
      video.controls = true;
      video.width = 300;
      editable.appendChild(video);
    }
  }
}

