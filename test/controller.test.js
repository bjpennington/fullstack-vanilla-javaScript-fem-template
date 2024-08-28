import assert from "node:assert";
import { describe, it, mock } from "node:test";
import Controller from "../src/shared/controller.js";
import ViewBase from "./../src/shared/viewBase.js";

function generateView() {
  class View extends ViewBase {
    configureFormSubmit = mock.fn();
    resetForm = mock.fn();
    notify = mock.fn();
    configureFormClear = mock.fn();
    addRow = mock.fn();
    render = mock.fn();
  }

  return new View();
}

describe("Controller unit test", () => {
  it("#init", () => {
    const view = generateView();
    Controller.init({
      view,
    });

    assert.strictEqual(view.configureFormSubmit.mock.callCount(), 1);
    assert.strictEqual(view.configureFormClear.mock.callCount(), 1);
    assert.strictEqual(view.render.mock.callCount(), 1);

    assert.deepStrictEqual(view.render.mock.calls.at(0).arguments.at(0), [
      { name: "Erick Wendel", age: 28, email: "erick@erick.com" },
      { name: "Ana Neri", age: 24, email: "ana@ana.com" },
      { name: "Marc Berg", age: 24, email: "marc@marc.com" },
    ]);
  });
});
