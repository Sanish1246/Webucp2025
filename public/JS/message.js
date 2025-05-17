// Store files globally as they are uploaded to keep order with messages
const uploadedFiles = [];

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

  document.getElementById('previewContainer').appendChild(mediaElement);

  // Save the file along with its media element for ordering
  uploadedFiles.push({ element: mediaElement, file });

  event.target.value = ''; // Reset file input
});

document.getElementById('saveMessage').addEventListener('click', () => {
  const container = document.getElementById('previewContainer');
  const formData = new FormData();

  // Include the editable title
  const titleElement = document.querySelector('h2[contenteditable]');
  const title = titleElement ? titleElement.innerText.trim() : '';
  formData.append('title', title);

  let textCount = 0;
  let fileCount = 0;

  for (const child of container.children) {
    if (child.tagName.toLowerCase() === 'p') {
      formData.append(`message${textCount}`, child.innerHTML);
      textCount++;
    } else if (child.tagName.toLowerCase() === 'img' || child.tagName.toLowerCase() === 'video') {
      const fileObj = uploadedFiles.find(f => f.element === child);
      if (fileObj) {
        formData.append(`file${fileCount}`, fileObj.file);
        fileCount++;
      }
    }
  }

  const prefs = JSON.parse(sessionStorage.getItem('userPreferences') || '{}');
formData.append('theme', prefs.theme || '');
formData.append('font', prefs.font || '');
formData.append('music', prefs.music || '');

  fetch('/api/post', {
    method: 'POST',
    body: formData,
  })
  .then(response => {
    if (!response.ok) throw new Error('Network response was not ok');
    return response.json();
  })
  .then(data => {
    console.log('Success:', data);
    container.innerHTML = '';
    uploadedFiles.length = 0;
    window.location.href = 'category.html'; 
  })
  .catch(error => {
    console.error('Error:', error);
  });
});
