const EventEmitter = require('events');
const Textbox = require('blessed').textbox;

var RE_SPECIAL = /[\x00-\x1F\x7F]+|(?:\x1B\[([0-9]{1,2}(;[0-9]{1,2})?)?[m|K])/g;

class InputController extends EventEmitter {
  constructor(ui, chatBus) {
    super();
    this._ui = ui;

    this._input = new Textbox({
      screen: this._ui.screen,
      bottom: 0,
      left: 20,
      height: 3,
      width: '100%',
      border: 'line',
      label: 'Input',
      inputOnFocus: true,
    });
    this._ui.appendElement(this._input);
    this._input.focus();

    // Read a line of input from the user
    this._submitListener = (...args) => this._onSubmit(...args);
    this._input.on('submit', this._submitListener);
  }

  close() {
    this._input.removeListener('submit', this._submitListener);
  }

  _onSubmit(line) {
    this._input.clearValue();
    this._ui.render();
    if (!this._input.focused) {
      this._input.focus();
    }
    line = line.replace(RE_SPECIAL, '').trim();
    this._parseLine(line);
  }

  _parseLine(line) {
    if (line.length > 0) {
      if (line.charAt(0) === '/') {
        const command = line.slice(1);
        this.emit('command', command);
      } else {
        this.emit('message', line);
      }
    }
  }
}

module.exports = InputController;
