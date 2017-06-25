const EventEmitter = require('events');

const MESSAGE_EVENT = 'message';
const REFRESH_EVENT = 'refresh-channels';

class ChatBus extends EventEmitter {
  _createBroadcastMessage(channel, sender, text) {
    return {
      isBroadcast: true,
      sender,
      channel,
      text,
    };
  }

  _createDM(channel, sender, text) {
    return {
      isDM: true,
      sender,
      channel,
      text,
    };
  }

  _createAdminMessage(channel, text) {
    return {
      isBroadcast: !channel.isDM,
      isDM: channel.isDM,
      isAdmin: true,
      sender: '',
      channel,
      text,
    };
  }

  broadcast(sender, channel, text) {
    process.nextTick(() => {
      this.emit(MESSAGE_EVENT, this._createBroadcastMessage(channel, sender, text));
    });
  }

  dm(sender, channel, text) {
    process.nextTick(() => {
      this.emit(MESSAGE_EVENT, this._createDM(channel, sender, text));
    });
  }

  join(username, channel) {
    process.nextTick(() => {
      this.emit(MESSAGE_EVENT, this._createAdminMessage(channel, `${username} has joined the chat`));
    });
  }

  leave(username, channel) {
    process.nextTick(() => {
      this.emit(MESSAGE_EVENT, this._createAdminMessage(channel, `${username} has left the chat`));
    });
  }

  refresh() {
    process.nextTick(() => {
      this.emit(REFRESH_EVENT);
    });
  }

  onMessage(handler) {
    this.on(MESSAGE_EVENT, handler);
  }

  removeMessageListener(handler) {
    this.removeListener(MESSAGE_EVENT, handler);
  }

  onRefreshChannels(handler) {
    this.on(REFRESH_EVENT, handler);
  }

  removeRefreshChannelsListener(handler) {
    this.removeListener(REFRESH_EVENT, handler);
  }
}

module.exports = ChatBus;
