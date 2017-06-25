const EventEmitter = require('events');
const uuid = require('uuid');

class Channel extends EventEmitter {
  constructor(chatBus, name) {
    super();
    this.id = uuid();
    this.name = name;
    this.chatBus = chatBus;

    this.log = [];

    this.messageListener = (...args) => this._onMessage(...args);
    this.chatBus.onMessage(this.messageListener);
  }

  _onMessage(messageDetails) {
    if (messageDetails.isBroadcast && messageDetails.channel.id === this.id) {
      this.log.push(messageDetails);
    }
  }
}

module.exports = Channel;
