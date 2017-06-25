const chat = require('./chat/chat');
const listener = require('./botkit/bot-listener');

function init(port, botConfig) {
  const controller = listener(chat.chatBus, botConfig);
  chat.server.listen(port || 51515, function () {
    console.log('Listening on port ' + this.address().port);
  });
  return controller;
}

module.exports = init;
