var fs = require('fs');
var crypto = require('crypto');
var Server = require('ssh2').Server;

const ChatBus = require('./chat-bus');
const Session = require('./session');
const ChannelManager = require('./channel-manager');

const chatBus = new ChatBus();

const channelManager = new ChannelManager(chatBus);

var sessions = [];

const password = 'password';

function server(keyFilename) {
  const keyFile = fs.readFileSync(keyFilename);
  return new Server({
    hostKeys: [ keyFile ],
  }, function (client) {
    var stream;
    var username;
    client.on('authentication', function (ctx) {
      username = ctx.username;
      if (ctx.method === 'password') {
        if (crypto.timingSafeEqual(password, ctx.password)) {
          return ctx.accept();
        } else {
          ctx.reject(['keyboard-interactive']);
        }
      } else if (ctx.method !== 'keyboard-interactive') {
        ctx.reject(['keyboard-interactive']);
      } else if (ctx.method === 'keyboard-interactive') {
        ctx.prompt({ prompt: 'Password? ', echo: true }, function retryPrompt(answers) {
          if (answers.length === 0) {
            return ctx.reject();
          } else {
            var ctxPassword = answers[0];
            if (crypto.timingSafeEqual(Buffer.from(password), Buffer.from(ctxPassword))) {
              return ctx.accept();
            } else {
              ctx.reject();
            }
          }
        });
      };
    }).on('ready', function () {
      var rows;
      var cols;
      var term;
      client.once('session', function (accept, reject) {
        accept().once('pty', function (accept, reject, info) {
          rows = info.rows;
          cols = info.cols;
          term = info.term;
          accept && accept();
        }).on('window-change', function (accept, reject, info) {
          rows = info.rows;
          cols = info.cols;
          if (stream) {
            stream.rows = rows;
            stream.columns = cols;
            stream.emit('resize');
          }
          accept && accept();
        }).once('shell', function (accept, reject) {
          stream = accept();
          stream.rows = rows || 24;
          stream.columns = cols || 80;
          stream.isTTY = true;
          stream.setRawMode = () => {};
          stream.on('error', (err) => {
            console.error(err);
          });
          sessions.push(new Session(username, stream, term, channelManager, chatBus));
        });
      });
    }).on('end', function () {
      if (stream !== undefined) {
        removeUser(username);
        // Let everyone else know that this user just left
      }
    }).on('error', function (err) {
      console.error(err);
    });
  });
}

function removeUser(username) {
  var userSession = sessions.find((user) => user.username === username);
  if (userSession) {
    userSession.close();
  }
  sessions = sessions.filter((user) => user.username !== username);
}

module.exports = { server, chatBus };
