import EventEmitter from '../services/event-emitter';

export default class View extends EventEmitter {
  constructor() {
    super();

    // For edit modal
    this.page = document.querySelector('.page');
    this.modal = document.querySelector('.modal');

    this.editCancelBtn = document.querySelector(
      '.modal button[data-action="edit-cancel"]',
    );
    this.editSuccessBtn = document.querySelector(
      '.modal button[data-action="edit-success"]',
    );

    this.form = document.querySelector('.note-editor');
    this.input = this.form.querySelector('.input');
    this.notesGrid = document.querySelector('.notes-grid');

    this.form.addEventListener('submit', this.handleAdd.bind(this));
    this.editCancelBtn.addEventListener(
      'click',
      this.handleEditCancel.bind(this),
    );

    this.editSuccessBtn.addEventListener(
      'click',
      this.handleEditSuccess.bind(this),
    );

    this.addNote = this.addNote.bind(this);
    this.removeNote = this.removeNote.bind(this);
    this.updateNote = this.updateNote.bind(this);
    this.init = this.init.bind(this);
  }

  handleAdd(evt) {
    evt.preventDefault();

    const { value } = this.input;

    if (value === '') return;

    this.emit('add', value);
  }

  handleEditCancel() {
    this.emit('edit-cancel');
  }

  handleEditSuccess() {
    const textarea = this.modal.querySelector('textarea');
    this.emit('edit-success', textarea.value);
  }

  createNote(note) {
    const item = document.createElement('div');
    item.classList.add('item');
    item.dataset.id = note.id;

    const text = document.createElement('p');
    text.classList.add('text');
    text.textContent = note.text;

    const actions = document.createElement('div');
    actions.classList.add('actions');

    const btnRemove = document.createElement('button');
    btnRemove.classList.add('button');
    btnRemove.textContent = 'Удалить';
    btnRemove.dataset.action = 'remove';

    const btnEdit = document.createElement('button');
    btnEdit.classList.add('button');
    btnEdit.textContent = 'Редактировать';
    btnEdit.dataset.action = 'edit';

    actions.append(btnEdit, btnRemove);

    item.append(text, actions);

    this.appendEventListeners(item);

    return item;
  }

  addNote(note) {
    const item = this.createNote(note);

    this.form.reset();

    this.notesGrid.appendChild(item);
  }

  appendEventListeners(item) {
    const removeBtn = item.querySelector("[data-action='remove']");
    const editStartBtn = item.querySelector("[data-action='edit']");

    removeBtn.addEventListener('click', this.handleRemove.bind(this));
    editStartBtn.addEventListener('click', this.handleEditStart.bind(this));
  }

  handleRemove({ target }) {
    const parent = target.closest('.item');

    this.emit('remove', parent.dataset.id);
  }

  handleEditStart({ target }) {
    const parent = target.closest('.item');

    this.emit('edit-start', Number(parent.dataset.id));
  }

  removeNote(id) {
    const item = this.notesGrid.querySelector(`[data-id="${id}"]`);
    this.notesGrid.removeChild(item);
  }

  openModal(note) {
    this.page.classList.add('show-modal');
    const textarea = this.modal.querySelector('textarea');
    textarea.value = note.text;
  }

  closeModal() {
    this.page.classList.remove('show-modal');
  }

  updateNote(note) {
    const noteTextEl = this.notesGrid.querySelector(
      `.item[data-id="${note.id}"] .text`,
    );

    noteTextEl.textContent = note.text;
  }

  init(notes) {
    const elements = notes.map(note => this.createNote(note));

    this.notesGrid.append(...elements);
  }
}
