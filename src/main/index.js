const chat = require('./chat/chat');

function init(port) {
  chat.server.listen(port || 51515, function () {
    console.log('Listening on port ' + this.address().port);
  });
}

module.exports = init;
