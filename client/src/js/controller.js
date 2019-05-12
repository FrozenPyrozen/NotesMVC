export default class Controller {
   constructor(model, view) {
    this.model = model;
    this.view = view;

    this.initFirst();

    this.view.on('add', this.addNote.bind(this));
    this.view.on('remove', this.removeNote.bind(this));
    this.view.on('edit-start', this.handleEditStart.bind(this));
    this.view.on('edit-cancel', this.handleEditCancel.bind(this));
    this.view.on('edit-success', this.handleEditSuccess.bind(this));
  }

  async initFirst() {
    const res = await this.model.fetchItems();
    
    this.view.init(res);
  }

  async handleEditSuccess(text) {
    const id = this.model.SelectedItemId;

    const res = await this.model.updateItem({ id, text });
    this.view.closeModal();
    this.view.updateNote(res);
  }

  async addNote(text) {
    const item = await this.model.addItem(text);
    this.view.addNote(item);
  }

  async removeNote(id) {
    const remId = await this.model.removeItem(id);
    this.view.removeNote(remId);
  }

  handleEditCancel() {
    this.view.closeModal();
  }

  async handleEditStart(id) {
    const item = this.model.findItem(id);
    this.model.SelectedItemId = id;
    this.view.openModal(item);
  }
}
