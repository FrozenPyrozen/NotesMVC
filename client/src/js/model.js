import axious from 'axios';

axious.defaults.baseURL = 'http://localhost:3000';

export default class Model {
  constructor(items = []) {
    this.items = items;
    this.selectedItemId = null;
  }

  set SelectedItemId(id) {
    this.selectedItemId = id;
  }

  get SelectedItemId() {
    return this.selectedItemId;
  }

  async fetchItems() {
    const res = await axious.get('/notes');
    return res.data;
    
  }

  findItem(id) {
    return this.items.find(item => item.id === id);
  }

  async addItem(text) {
    const itemToAdd = {
      text,
    };

    const response = await axious.post(
      '/notes',
      itemToAdd,
    );
    const item = response.data;

    this.items.push(item);
    return item;
  }

  async updateItem(noteToUpdate) {
    const res = await axious.patch(
      `/notes/${noteToUpdate.id}`,
      noteToUpdate,
    );

    const updatedItem = res.data;

    let item = this.findItem(updatedItem.id);
    item = Object.assign(item, updatedItem);

    return item;
  }

  async removeItem(id) {
    const res = await axious.delete(`/notes/${id}`);

    if (res.status === 200) {
      this.items = this.items.filter(item => item.id !== id);
      return id;
    }
  }
}
