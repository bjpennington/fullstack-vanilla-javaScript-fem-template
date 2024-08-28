import { describe, it, before } from 'node:test';
import Controller from '../src/shared/controller.js';
import View from './../src/platforms/web/view.js';
import assert from 'node:assert';

function getDocument(mock) {
  globalThis.alert = mock.fn(),
  globalThis.document = {
    querySelector: mock.fn((selector) => ({
      value: 'test',
      appendChild: mock.fn((child) => {}),
      addEventListener: mock.fn((event, fn) => {
        return fn({
          preventDefault: () => {},
        });
      }),
      reset: mock.fn(() => {}),
    })),
    createElement: mock.fn((element) => ({
      classList: {
        add: mock.fn((className) => {})
      },
    })),
  };

  return globalThis.document;
}


describe('Web app test suite', () => {
  it('given valid input, should update the table data', async (context) => {
    const document = getDocument(context.mock);
    const view = new View();

    const addRow = context.mock.method(view, view.addRow.name);
    const _controller = Controller.init({ view });

    const [
      name,
      age,
      email,
      tableBody,
      form,
      btnFormClear
    ] = document.querySelector.mock.calls;

    assert.strictEqual(name.arguments[0], '#name');
    assert.strictEqual(age.arguments[0], '#age');
    assert.strictEqual(email.arguments[0], '#email');
    assert.strictEqual(tableBody.arguments[0], '.flex-table');
    assert.strictEqual(form.arguments[0], '#form');
    assert.strictEqual(btnFormClear.arguments[0], '#btnFormClear');

    const onSubmit = form.result.addEventListener.mock.calls[0].arguments[1];
    const preventDefaultSpy = context.mock.fn();
    assert.strictEqual(addRow.mock.callCount(), 4);

    onSubmit({
      preventDefault: preventDefaultSpy,
    });

    assert.strictEqual(addRow.mock.callCount(), 5);

    assert.deepStrictEqual(addRow.mock.calls.at(4).arguments.at(0), {
      name: 'test',
      age: 'test',
      email: 'test',
    });
  });
});
