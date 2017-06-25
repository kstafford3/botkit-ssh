const EventEmitter = require('events');
const BlessedScreen = require('blessed').screen;
const BlessedProgram = require('blessed').program;

class UI extends EventEmitter {
  constructor(stream, username, term) {
    super();
    this._stream = stream;
    this._screen = new BlessedScreen({
      autoPadding: true,
      smartCSR: true,
      program: new BlessedProgram({
        input: this._stream,
        output: this._stream,
      }),
      terminal: term || 'ansi',
    });

    this._screen.title = 'SSH Chatting as ' + username;
    // Disable local echo
    this._screen.program.attr('invisible', true);
  }

  close() {
  }

  appendElement(element) {
    this._screen.append(element);
  }

  render() {
    this._screen.render();
  }

  resize() {
    // XXX This fake resize event is needed for some terminals in order to
    // have everything display correctly
    this._screen.program.emit('resize');
  }
};

module.exports = UI;
