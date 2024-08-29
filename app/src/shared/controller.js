/**
 * @typedef {import('./viewBase.js').default} View
 * @typedef {import('./service.js').default} Service
 */
export default class Controller {
  /** @type { View } */
  #view;

  /** @type { Service } */
  #service;

  /** @param {{ view: View, service: Service }} deps */
  constructor({ view, service }) {
    this.#view = view;
    this.#service = service;
  }

  static async init(deps) {
    const controller = new Controller(deps);
    await controller.#init();
    return controller;
  }

  #isValid(data) {
    return data.name && data.age && data.email;
  }

  #onSubmit({ name, age, email }) {
    if (!this.#isValid({ name, age, email })) {
      this.#view.notify({
        msg: "Please fill out all the fields",
        isError: false,
      });
      return;
    }

    this.#view.addRow({ name, age, email });
    this.#view.resetForm();
  }

  async #getUsersFromAPI() {
    try {
      const result = await this.#service.getUsers();
      return result;
    } catch (error) {
      this.#view.notify({ msg: "server is not available" });
      return [];
    }
  }

  async #init() {
    this.#view.configureFormSubmit(this.#onSubmit.bind(this));
    this.#view.configureFormClear();

    const data = await this.#getUsersFromAPI();

    const initialData = [
      { name: "Erick Wendel", age: 28, email: "erick@erick.com" },
      { name: "Ana Neri", age: 24, email: "ana@ana.com" },
      { name: "Marc Berg", age: 24, email: "marc@marc.com" },
      ...data,
    ];

    this.#view.render(initialData);
  }
}
