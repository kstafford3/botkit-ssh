const EventEmitter = require('events');
const chalk = require('chalk');

const UI = require('./ui');
const ChannelsController = require('./controllers/channels-controller');
const MessageLogController = require('./controllers/message-log-controller');
const InputController = require('./controllers/input-controller');

const QUIT_COMMANDS = ['q', 'quit', 'exit'];
const CHANNEL_COMMANDS = ['ch', 'channel'];
const DM_COMMANDS = ['dm', 'direct_message'];

const WELCOME_TEXT = `${chalk.cyan('Welcome to SSH Chat!')}\n`
                     + `Type ${chalk.bold('/q')}, ${chalk.bold('/quit')}, or ${chalk.bold('/exit')} to exit the chat.\n`
                     + `Type ${chalk.bold('/ch {channel}')} or ${chalk.bold('/channel {channel}')} to change channels.\n`
                     + `Type ${chalk.bold('/dm {username}')} or ${chalk.bold('/direct_message {username}')} to direct message a user.\n`
                     + `\n`
                     + `This chat is meant as a testing tool for chat bots, never for secure communication.\n`
                     + `DO NOT USE THIS APPLICATION AS FOR CHAT. IT IS NOT SECURE.\n`;

class Session extends EventEmitter {
  constructor(username, stream, term, channelManager, chatBus) {
    super();
    this.username = username;
    this._stream = stream;
    this._channelManager = channelManager;
    this._chatBus = chatBus;

    this._channel = null;

    this._ui = new UI(stream, username, term);
    this._channelsController = new ChannelsController(this._ui, this._chatBus, this._channelManager, this.username);
    this._messageLogController = new MessageLogController(this._ui, this._chatBus);
    this._inputController = new InputController(this._ui);

    this._ui.render();
    this._ui.resize();

    this._inputCommandListener = (...args) => this._onInputCommand(...args);
    this._inputController.on('command', this._inputCommandListener);
    this._inputMessageListener = (...args) => this._onInputMessage(...args);
    this._inputController.on('message', this._inputMessageListener);

    this._setChannel(this._channelManager.getDefaultChannel(), WELCOME_TEXT);
    this._channelsController.refreshChannels();
  }

  close() {
    this._inputController.removeListener('command', this._inputCommandListener);
    this._inputController.removeListener('message', this._inputMessageListener);
    this._channelsController.close();
    this._messageLogController.close();
    this._inputController.close();
    this._ui.close();
  }

  _onInputCommand(command) {
    const words = command.split(/\s+/);
    if (QUIT_COMMANDS.indexOf(words[0]) !== -1) {
      this._chatBus.leave(this.username, this._channel);
      this._stream.end();
    } else if (CHANNEL_COMMANDS.indexOf(words[0]) !== -1) {
      const channelName = words[1];

      this._setChannelByName(channelName);
    } else if (DM_COMMANDS.indexOf(words[0]) !== -1) {
      const dmTarget = words[1];
      this._setDMChannel(dmTarget);
    }
  }

  _onInputMessage(message) {
    if (this._channel.isDM) {
      this._chatBus.dm(this.username, this._channel, message);
    } else {
      this._chatBus.broadcast(this.username, this._channel, message);
    }
  }

  _setChannelByName(channelName) {
    this._setChannel(this._channelManager.getPublicChannelByName(channelName));
  }

  _setDMChannel(target) {
    this._setChannel(this._channelManager.getDMByUsers(this.username, target));
  }

  _setChannel(channel, welcomeText) {
    if (this._channel !== null) {
      this._chatBus.leave(this.username, this._channel);
    }
    this._channel = channel;
    this._messageLogController.setChannel(this._channel, welcomeText);
    this._chatBus.join(this.username, this._channel);
  }
};

module.exports = Session;
