# SSH Botkit
*An SSH Chat and Connector for Botkit*

This is a SSH based chat server and botkit connector for testing bots in a chat-like environment.

The chat server is not a production-ready system. The goal here is to provide a simple chat-like interface to test your chatbot. 

## Installing

```
npm install --save botkit-ssh
```
botkit-ssh exports the `start`, `chat`, and `listener`.

## `start`

The function `start(config)` starts a chat server and returns a bot controller that will receive events from the chat server.

The `config.port` parameter indicates the port that the chat server will listen on, it defaults to 51515.

The `config.keyFilename` should indicate the filename of the private host key for the ssh server, it defaults to './ssh/key'.

The following sample assumes that you have generated an ssh key in './ssh/key'.

```javascript
const botkitSSH = require('botkit-ssh');

const controller = botkitSSH.start();
controller.spawn();

controller.hears('hello', 'message_received', function (bot, message) {
  bot.reply(message, 'Hello Yourself!');
});
```

Your chat username will be the ssh username, the password is 'password'.

## `chat` and `listener`

Internally, start is starting a chat-server and an ssh-bot listening to it.

```javascript
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
```

## Chat Commands

### Quit
```
/q
/quit
/exit
```

### Change Channels
New channels will automatically be created
```
/ch {channel name}
```

### Direct Message Channels
DMs are treated like channels, accessed via the `/dm` command.
```
/dm {recipient}
```
