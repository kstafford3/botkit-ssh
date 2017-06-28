const List = require('blessed').list;
const chalk = require('chalk');

class ChannelsController {
  constructor(ui, chatBus, channelManager, username) {
    this._ui = ui;
    this._chatBus = chatBus;
    this._channelManager = channelManager;
    this._username = username;

    this._channelList = new List({
      screen: ui.screen,
      label: chalk.bold('CHANNELS'),
      border: 'line',
      top: 0,
      left: 0,
      width: 20,
      bottom: 0,
    });
    ui.appendElement(this._channelList);

    this._refreshChannelsListener = (...args) => this.refreshChannels(...args);
    this._chatBus.onRefreshChannels(this._refreshChannelsListener);
  }

  close() {
    this._chatBus.removeRefreshChannelsListener(this._refreshChannelsListener);
  }

  refreshChannels() {
    var channelItems = [];
    channelItems = channelItems.concat(this._channelManager.getAllPublicChannels().map((channel) => channel.name));
    channelItems = channelItems.concat(this._channelManager.getUserDMs(this._username).map((dm) => dm.name));
    this._channelList.setItems(channelItems);
    this._ui.render();
  }
};

module.exports = ChannelsController;
