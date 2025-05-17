const door  = document.getElementById('doorVideo');
const grid  = document.getElementById('choiceGrid');

/* Try to autoplay; if it fails, we'll still reveal grid by timeout */
door.play().catch(() => {});

/* When video finishes, fade it out and show grid */
door.addEventListener('ended', finishIntro);

/* Safety-net: reveal grid even if autoplay blocked or video missing */
setTimeout(finishIntro, 9000);

function finishIntro() {
  if (!grid.classList.contains('hide')) return;   // already revealed
  door.classList.add('hide');                      // fade video
  grid.classList.remove('hide');                   // show grid (still tiny)

  // next browser paint → add .grow to trigger the transition
  requestAnimationFrame(() => grid.classList.add('grow'));
}

/* --------------------------------------------
   1.  Option tables
--------------------------------------------- */
const OPTIONS = {
  'Ironic': { fonts:['Comic Sans MS','Papyrus','Jokerman'],
              music:['Chiptune 8-bit','Meme Mashup','Vaporwave'] },
  'Dramatic': { fonts:['Playfair Display','Cinzel'],
                music:['Sad Violin','Thunder Roll'] },
  'Super Cringe': { fonts:['Comic Sans MS','Indie Flower'],
                    music:['Clown Horn','Boing Sound'] },
  'Classy': { fonts:['Georgia','Merriweather'],
              music:['Soft Piano','Harp Exit'] },
  'Passive Aggressive': { fonts:['Baskerville','Courier New'],
                          music:['Sassy Strings','Drip Sound'] },
  'Honest': { fonts:['Arial','Verdana','Open Sans'],
              music:['Acoustic Folk','Indie Rock','Lo-fi Chill'] }
};

/* --------------------------------------------
   2.  Handles
--------------------------------------------- */
const cards     = document.querySelectorAll('.card');
const modal     = document.getElementById('prefModal');
const backdrop  = document.getElementById('backdrop');
const cancelBtn = document.getElementById('cancel');
const dynArea   = document.getElementById('dynamicFields');
const prefTitle = document.getElementById('prefTitle');

/* --------------------------------------------
   3.  Build fields for a label
--------------------------------------------- */
function buildFields(label) {
  const {fonts, music} = OPTIONS[label] || OPTIONS['Honest'];
  prefTitle.textContent = `${label} Preferences`;
  dynArea.innerHTML = `
    <label class="field">
      <span>Font style</span>
      <select name="font">
        ${fonts.map(f => `<option>${f}</option>`).join('')}
      </select>
    </label>
    <label class="field">
      <span>Music genre</span>
      <select name="music">
        ${music.map(m => `<option>${m}</option>`).join('')}
      </select>
    </label>`;
}

/* --------------------------------------------
   4.  Card click → open modal, exclusive outline
--------------------------------------------- */
cards.forEach(card => {
  card.addEventListener('click', () => {
    cards.forEach(c => c.classList.remove('selected'));
    card.classList.add('selected');
    buildFields(card.textContent.trim());
    toggleModal(true);
  });
});

/* --------------------------------------------
   5.  Modal show/hide helpers
--------------------------------------------- */
function toggleModal(show) {
  [modal, backdrop].forEach(el => {
    el.classList.toggle('hide', !show);
    el.classList.toggle('show', show);
  });
}
backdrop.addEventListener('click', () => toggleModal(false));
cancelBtn.addEventListener('click', () => toggleModal(false));

/* --------------------------------------------
   6.  Save handler (store in sessionStorage and redirect)
--------------------------------------------- */
modal.addEventListener('submit', e => {
  e.preventDefault();

  // Get form data from modal inputs
  const data = Object.fromEntries(new FormData(modal));

  // Get the selected theme from the card with class 'selected'
  const selectedCard = document.querySelector('.card.selected');
  const theme = selectedCard ? selectedCard.textContent.trim() : 'Honest';

  // Add theme to data
  data.theme = theme;

  // Save preferences to sessionStorage as JSON string
  sessionStorage.setItem('userPreferences', JSON.stringify(data));

  // Redirect to category.html
  window.location.href = 'message.html';
});

// Optional: toggle dark mode for the document
document.documentElement.classList.toggle('dark');

async function openLogin(event){
  event.preventDefault();
    try {
const response = await fetch('/login');
const data = await response.json();
if (data.email) {
  window.location.href = '/user-page.html';
} else {
  window.location.href = '/account.html';
}
console.log(data);
} catch (error) {
console.error('Error:', error);
}
}