const start = require('../lib/index').start;

const controller = start();
controller.spawn();

controller.hears('hello', 'ambient', function (bot, message) {
  bot.reply(message, 'I don\'t like public speaking');
});

controller.hears('hello', 'mention', function (bot, message) {
  bot.reply(message, `I don't like public speaking, @${message.user}`);
});

controller.hears('hello', 'direct_mention', function (bot, message) {
  bot.reply(message, `@${message.user}, I don't like public speaking`);
});

controller.hears('hello', 'direct_message', function (bot, message) {
  bot.reply(message, 'Hello Yourself!');
});
