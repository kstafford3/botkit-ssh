const EventEmitter = require('events');

const Channel = require('./channel');
const DMChannel = require('./dm-channel');

class ChannelManager extends EventEmitter {
  constructor(chatBus) {
    super();
    this._chatBus = chatBus;

    this._DEFAULT_CHANNEL_NAME = 'general';
    this._channels = {};
    this._createPublicChannel(this._DEFAULT_CHANNEL_NAME);
  }

  _addChannel(channel) {
    this._channels[channel.id] = channel;
    this._chatBus.refresh();
    return channel;
  }

  _createPublicChannel(channelName) {
    return this._addChannel(new Channel(this._chatBus, channelName));
  }

  _createDM(sourceUsername, targetUsername) {
    return this._addChannel(new DMChannel(this._chatBus, sourceUsername, targetUsername));
  }

  getPublicChannelByName(channelName) {
    var lowerName = channelName.toLowerCase();
    var channel = Object.values(this._channels).find((channel) => {
      return !channel.isDM && channel.name === lowerName;
    });
    if (!channel) {
      channel = this._createPublicChannel(channelName);
    }
    return channel;
  }

  getDMByUsers(sourceUsername, targetUsername) {
    var matchingDM = Object.values(this._channels).find((channel) => {
      return channel.isDM && channel.isMatchingDM(sourceUsername, targetUsername);
    });
    if (!matchingDM) {
      matchingDM = this._createDM(sourceUsername, targetUsername);
    }
    return matchingDM;
  }

  getAllPublicChannels() {
    return Object.values(this._channels).filter((channel) => !channel.isDM);
  }

  getUserDMs(username) {
    return Object.values(this._channels).filter((channel) => {
      return (channel.isDM && channel.containsUser(username));
    });
  }

  getDefaultChannel() {
    return this.getPublicChannelByName(this._DEFAULT_CHANNEL_NAME);
  }
};

module.exports = ChannelManager;
