const core = require('botkit').core;
const SSHBot = require('./ssh-bot');

function listener(chatBus, configuration) {
  let corebot = core(configuration || {});

  corebot.middleware.spawn.use(function (bot, next) {
    corebot.startTicking();

    chatBus.onMessage((messageDetails) => {
      if (messageDetails.sender !== bot.identity.id) {
        // translate to botkit message with some extra metadata
        corebot.receiveMessage(bot, {
          isBroadcast: messageDetails.isBroadcast,
          isDM: messageDetails.isDM,
          isAdmin: messageDetails.isAdmin,
          now: Date.now(),
          channel: messageDetails.channel,
          user: messageDetails.sender,
          text: messageDetails.text,
        });
      }
    });

    next();
  });

  corebot.defineBot(function (botkit, config) {
    return new SSHBot(chatBus, botkit, config);
  });

  corebot.on('message_received', (bot, msg) => {
    let evt;
    if (msg.isDM && msg.channel.containsUser(bot.identity.id)) {
      evt = 'direct_message';
    } else {
      if (RegExp(`^@${bot.identity.id}`, 'i').test(msg.text)) {
        msg.text = msg.text.replace(RegExp(`^@${bot.identity.id}:?\\s*`, 'i'), '');
        evt = 'direct_mention';
      } else if (RegExp(`@${bot.identity.id}`, 'i').test(msg.text)) {
        evt = 'mention';
      } else evt = 'ambient';
    }
    corebot.trigger(evt, [bot, msg]);
  });

  return corebot;
};

module.exports = listener;
