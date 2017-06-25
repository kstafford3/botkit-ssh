const Channel = require('./channel');

class DMChannel extends Channel {
  constructor(chatBus, usernameA, usernameB) {
    super(chatBus, `DM: ${usernameA}, ${usernameB}`);
    if (usernameA === usernameB) {
      // talking to yourself
      this.users = [ usernameA ];
    } else {
      this.users = [ usernameA, usernameB ];
    }
    this.isDM = true;
  }

  getReceiver(sender) {
    var otherUser = this.users.find((user) => user !== sender);
    return otherUser || sender; // if otherUser is falsey, you're talking to yourself
  }

  isMatchingDM(usernameA, usernameB) {
    return this.containsUser(usernameA) && this.containsUser(usernameB);
  }

  containsUser(username) {
    return this.users.indexOf(username) !== -1;
  }

  _onMessage(messageDetails) {
    if (messageDetails.isDM && messageDetails.channel.id === this.id) {
      this.log.push(messageDetails);
    }
  }
}

module.exports = DMChannel;
