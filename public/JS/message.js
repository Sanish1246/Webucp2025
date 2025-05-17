document.getElementById('sendMessage').addEventListener('click', () => {
  const text = document.getElementById('bioInput').value.trim();
  if (text !== '') {
    const messageDiv = document.createElement('div');
    messageDiv.className = 'preview-item';
    messageDiv.innerHTML = text.replace(/\n/g, '<br>');
    document.getElementById('previewContainer').appendChild(messageDiv);
    document.getElementById('bioInput').value = '';
  }
});

document.getElementById('mediaUpload').addEventListener('change', (event) => {
  const file = event.target.files[0];
  if (!file) return;

  const previewItem = document.createElement('div');
  previewItem.className = 'preview-item';

  const mediaType = file.type.startsWith('image/') ? 'img' :
                    file.type.startsWith('video/') ? 'video' : null;
  if (!mediaType) return;

  const mediaElement = document.createElement(mediaType);
  mediaElement.src = URL.createObjectURL(file);
  if (mediaType === 'video') {
    mediaElement.controls = true;
  }

  previewItem.appendChild(mediaElement);
  document.getElementById('previewContainer').appendChild(previewItem);

  event.target.value = ''; // Reset file input
});
