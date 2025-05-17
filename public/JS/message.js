document.getElementById('sendMessage').addEventListener('click', () => {
  const text = document.getElementById('bioInput').value.trim();
  if (text !== '') {
    const textNode = document.createElement('p');
    textNode.innerHTML = text.replace(/\n/g, '<br>');
    textNode.className = 'text-lg leading-relaxed text-[#2D2B22] mb-2';
    document.getElementById('previewContainer').appendChild(textNode);
    document.getElementById('bioInput').value = '';
  }
});

document.getElementById('mediaUpload').addEventListener('change', (event) => {
  const file = event.target.files[0];
  if (!file) return;

  const mediaType = file.type.startsWith('image/') ? 'img' :
                    file.type.startsWith('video/') ? 'video' : null;
  if (!mediaType) return;

  const mediaElement = document.createElement(mediaType);
  mediaElement.src = URL.createObjectURL(file);

  if (mediaType === 'video') {
    mediaElement.controls = true;
  }


  mediaElement.className = 'my-4 rounded-xl shadow-md';
  mediaElement.style.maxWidth = '100%';
  mediaElement.style.maxHeight = '300px';
  mediaElement.style.objectFit = 'contain';
  mediaElement.style.display = 'block';
  mediaElement.style.margin = '0 auto';

  document.getElementById('previewContainer').appendChild(mediaElement);

  event.target.value = ''; // Reset file input
});