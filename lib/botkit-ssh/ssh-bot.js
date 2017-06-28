class SSHBot {
  constructor(chatBus, botkit, config) {
    this.chatBus = chatBus;
    this.botkit = botkit;
    this.config = config;
    this.utterances = botkit.utterances;
    this.identity = {
      id: 'sshbot',
      name: 'SSHBot',
    };
  }

  startPrivateConversation(message, callback) {
    throw new Error('Not Implemented');
  }

  startConversation(message, callback) {
    throw new Error('Not Implemented');
  }

  send(message, callback) {
    throw new Error('Not Implemented');
  }

  replyPublic(src, resp, callback) {
    throw new Error('Not Implemented');
  }

  replyPublicDelayed(src, resp, callback) {
    throw new Error('Not Implemented');
  }

  replyPrivate(src, resp, callback) {
    throw new Error('Not Implemented');
  }

  replyPrivateDelayed(src, resp, callback) {
    throw new Error('Not Implemented');
  }

  reply(src, resp, callback) {
    if (src.isDM) {
      this.chatBus.dm(this.identity.id, src.channel, resp);
    } else {
      this.chatBus.broadcast(this.identity.id, src.channel, resp);
    }
  }

  replyInThread(src, resp, callback) {
    throw new Error('Not Implemented');
  }

  startTyping(src, resp, callback) {
    throw new Error('Not Implemented');
  }

  replyWithTyping(src, resp, callback) {
    throw new Error('Not Implemented');
  }

  findConversation(message, callback) {
    this.botkit.tasks.forEach((task) => {
      task.convos.forEach((convo) => {
        if (convo.isActive()
          && convo.source_message.user === message.user
          && convo.source_message.channel.id === message.channel.id) {
          callback(convo);
          return;
        }
      });
    });
    callback();
  }
};

module.exports = SSHBot;
