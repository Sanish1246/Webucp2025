function addMessage(){
    const messageContainer = document.getElementById("display-message");
    const messageElement = document.createElement('p');
    messageElement.innerHTML=document.getElementById('upload-message').value;
    messageContainer.appendChild(messageElement);
    document.getElementById('upload-message').value="";
}

function addMedia() {
    const fileInput = document.getElementById("file-input");
    const messageContainer = document.getElementById("display-message");

    const file = fileInput.files[0];
    if (!file) return;

    const mediaElement = document.createElement(file.type.startsWith("image/") ? "img" : "video");

    mediaElement.src = URL.createObjectURL(file);
    mediaElement.style.maxWidth = "400px";
    mediaElement.style.maxHeight = "1000px";
    mediaElement.style.margin = "0.5rem 0";

    if (file.type.startsWith("video/")) {
        mediaElement.controls = true;
    }

    messageContainer.appendChild(mediaElement);
    fileInput.value = "";
}