const body = document.querySelector('body');
const create = document.querySelector('#create');
const darkBtn = document.querySelector('#dark');
const container = document.querySelector('.container');
const form = document.getElementById('noteForm');
const tagline = document.querySelector('.tagline');
const notesContainer = document.querySelector('.listnote');
const hero = document.querySelector('.hero');
let formRevealed = false;

let notes = JSON.parse(localStorage.getItem('notes')) || [];

function saveNotes() {
  localStorage.setItem('notes', JSON.stringify(notes));
}
function toggleDarkMode() {
  body.classList.toggle('dark');
}
darkBtn.addEventListener('click', toggleDarkMode);

create.addEventListener('click', () => {
  if (!formRevealed) {
    form.classList.remove('hidden-form');
    form.scrollIntoView({ behavior: 'smooth' });
    formRevealed = true;
  } else {
    document.querySelector('.note-title').focus();
  }
});

form.addEventListener('submit', function (e) {
  e.preventDefault();

  const titleInput = document.querySelector('.note-title');
  const contentInput = document.querySelector('.note');

  const title = titleInput.value.trim();
  const content = contentInput.value.trim();
  if (!title || !content) return;

  const note = {
    id: Date.now(),
    title,
    content,
    date: new Date().toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  };

  notes.push(note);
  saveNotes();
  displayNotes();
  form.reset();
  form.classList.add('hidden-form');
  formRevealed = false;
  applyOnce();
});

function displayNotes() {
  notesContainer.innerHTML = '';

  if (notes.length === 0) {
    tagline.textContent = 'No notes yet. Your ideas deserve a home.';
    return;
  }

  tagline.style.display='none'
  applyOnce();

  notes.forEach(note => {
    const li = document.createElement('li');
    li.className = 'note-item';

    li.innerHTML = `
      <div class="note-view">
        <h2>${note.title}</h2>
        <div class="notebox">
          <p>${note.content}</p>
        </div>
        <div class="dc">
          <h6 class="date">${note.date}</h6>
          <button class="edit" data-id="${note.id}">Edit</button>
          <button class="clear" data-id="${note.id}">Remove</button>
        </div>
      </div>
    `;

    notesContainer.appendChild(li);

    li.querySelector('.clear').addEventListener('click', () => {
      notes = notes.filter(n => n.id !== note.id);
      saveNotes();
      displayNotes();
    });

    li.querySelector('.edit').addEventListener('click', () => {
      renderEditForm(li, note);
    });
  });
}

function renderEditForm(li, note) {
  li.innerHTML = `
    <form class="edit-form">
      <input type="text" value="${note.title}" class="note-title" />
      <textarea class="note">${note.content}</textarea>
      <div class="dc">
        <button type="submit" class="addb">Save</button>
        <button type="button" class="clear cancel">Cancel</button>
      </div>
    </form>
  `;

  const editForm = li.querySelector('.edit-form');
  const cancelBtn = li.querySelector('.cancel');

  editForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const newTitle = editForm.querySelector('.note-title').value.trim();
    const newContent = editForm.querySelector('.note').value.trim();

    if (!newTitle || !newContent) return;

    note.title = newTitle;
    note.content = newContent;
    saveNotes();
    displayNotes();
  });

  cancelBtn.addEventListener('click', () => {
    displayNotes();
  });
}

function applyOnce() {
  if (notes.length > 0 && !hero.classList.contains('once')) {
    hero.classList.add('once');
  }
}

displayNotes();

if (notes.length > 0) {
  form.classList.add('hidden-form');
  formRevealed = false;
  applyOnce();
}
