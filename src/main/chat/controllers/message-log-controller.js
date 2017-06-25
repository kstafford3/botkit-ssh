const Log = require('blessed').log;
const chalk = require('chalk');

class MessageLogController {
  constructor(ui, chatBus) {
    this._channel = null;
    this._chatBus = chatBus;
    this._log = new Log({
      screen: ui.screen,
      top: 0,
      left: 20,
      width: '100%',
      bottom: 3,
      label: 'Unspecified Chat',
      border: 'line',
      scrollOnInput: true,
    });
    ui.appendElement(this._log);
    this._messageListener = (...args) => this._onMessage(...args);
    this._chatBus.onMessage(this._messageListener);
  }

  close() {
    this._chatBus.removeMessageListener(this._messageListener);
  }

  setChannel(channel, welcomeText) {
    this._clear();
    this.print(welcomeText);
    this._channel = channel;
    this._log.setLabel(channel.name);
    this._setLog(channel.log);
  }

  print(message) {
    if (message) {
      this._log.add(message);
    }
  }

  _onMessage(messageDetails) {
    if (this._channel === null) {
      // we're still initializing, don't show message
      return;
    }

    if (messageDetails.channel.id === this._channel.id) {
      if (messageDetails.isAdmin) {
        this.print(chalk.magenta(messageDetails.text));
      } else {
        this.print(`${chalk.yellow(messageDetails.sender)}: ${messageDetails.text}`);
      }
    }
  }

  _clear() {
    this._log.setText('');
  };

  _setLog(log) {
    log.forEach((msg) => {
      this._onMessage(msg);
    });
  }
};

module.exports = MessageLogController;
