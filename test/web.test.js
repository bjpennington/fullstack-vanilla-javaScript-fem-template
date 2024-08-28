import { describe, it } from "node:test";
import Controller from "../src/shared/controller.js";
import View from "./../src/platforms/web/view.js";
import assert from "node:assert";

function getDocument(
  mock,
  inputs = { name: "test", age: "test", email: "test" },
) {
  (globalThis.alert = mock.fn()),
    (globalThis.document = {
      querySelector: mock.fn((selector) => ({
        value: inputs[selector.replace("#", "")] ?? "test",
        appendChild: mock.fn((_child) => {}),
        addEventListener: mock.fn((_event, fn) => {
          return fn({
            preventDefault: () => {},
          });
        }),
        reset: mock.fn(() => {}),
      })),
      createElement: mock.fn((_element) => ({
        classList: {
          add: mock.fn((_className) => {}),
        },
      })),
    });

  return globalThis.document;
}

describe("Web app test suite", () => {
  it("captures all the form elements", (context) => {
    const document = getDocument(context.mock);
    const view = new View();

    Controller.init({ view });

    const [name, age, email, tableBody, form, btnFormClear] =
      document.querySelector.mock.calls;

    assert.strictEqual(name.arguments[0], "#name");
    assert.strictEqual(age.arguments[0], "#age");
    assert.strictEqual(email.arguments[0], "#email");
    assert.strictEqual(tableBody.arguments[0], ".flex-table");
    assert.strictEqual(form.arguments[0], "#form");
    assert.strictEqual(btnFormClear.arguments[0], "#btnFormClear");
  });

  it("given valid input, should update the table data", async (context) => {
    const document = getDocument(context.mock);
    const view = new View();

    const addRow = context.mock.method(view, view.addRow.name);
    Controller.init({ view });

    const form = document.querySelector.mock.calls.at(4);

    const onSubmit = form.result.addEventListener.mock.calls[0].arguments[1];
    const preventDefaultSpy = context.mock.fn();
    assert.strictEqual(addRow.mock.callCount(), 4);

    onSubmit({
      preventDefault: preventDefaultSpy,
    });

    assert.strictEqual(addRow.mock.callCount(), 5);

    assert.deepStrictEqual(addRow.mock.calls.at(4).arguments.at(0), {
      name: "test",
      age: "test",
      email: "test",
    });
  });

  it("given invalid data, should call alert with message", async (context) => {
    const document = getDocument(context.mock, {
      age: "",
      name: "",
      email: "",
    });

    const view = new View();

    const notify = context.mock.method(view, view.notify.name);
    const addRow = context.mock.method(view, view.addRow.name);

    Controller.init({ view });

    const form = document.querySelector.mock.calls.at(4);

    const onSubmit = form.result.addEventListener.mock.calls[0].arguments[1];
    const preventDefaultSpy = context.mock.fn();
    assert.strictEqual(notify.mock.callCount(), 1);
    assert.strictEqual(addRow.mock.callCount(), 3);

    onSubmit({
      preventDefault: preventDefaultSpy,
    });

    assert.strictEqual(notify.mock.callCount(), 2);
    assert.strictEqual(addRow.mock.callCount(), 3);

    assert.deepStrictEqual(notify.mock.calls.at(1).arguments.at(0), {
      isError: false,
      msg: "Please fill out all the fields",
    });
  });
});
