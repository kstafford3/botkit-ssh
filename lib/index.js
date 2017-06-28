const chat = require('./chat-server/index');
const listener = require('./botkit-ssh/index');

function start(config) {
  const _config = config || {};
  const _port = _config.port || 51515;
  const _keyFilename = _config.keyFilename || './ssh/key';

  const controller = listener(chat.chatBus);
  chat.server(_keyFilename).listen(_port, function () {
    console.log('Listening on port ' + this.address().port);
  });
  return controller;
}

module.exports = { start, chat, listener };
