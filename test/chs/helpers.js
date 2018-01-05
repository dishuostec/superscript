import fs from 'fs';
import _ from 'lodash';
import async from 'async';
import sfacts from 'sfacts';
import parser from '@dishuostec/ss-parser';
import chs from 'ss-chs';

import SuperScript from '../../src/bot/index';

const colorBlack = '\u001b[30m';
const colorRed = '\u001b[31m';
const colorGreen = '\u001b[32m';
const colorYellow = '\u001b[33m';
const colorBlue = '\u001b[34m';
const colorMagenta = '\u001b[35m';
const colorCyan = '\u001b[36m';
const colorWhite = '\u001b[37m';
const colorReset = '\u001b[0m';

let bot;

const getBot = function getBot() {
  return bot;
};

const data = [
  // './test/fixtures/concepts/bigrams.tbl', // Used in Reason tests
  // './test/fixtures/concepts/trigrams.tbl',
  // './test/fixtures/concepts/concepts.top',
  // './test/fixtures/concepts/verb.top',
  // './test/fixtures/concepts/color.tbl',
  // './test/fixtures/concepts/opp.tbl'
];

/* const botData = [
  './test/fixtures/concepts/botfacts.tbl',
  './test/fixtures/concepts/botown.tbl',
];*/

// If you want to use data in tests, then use bootstrap
const bootstrap = function bootstrap(cb) {
  sfacts.load('mongodb://localhost/superscripttest', data, true, (err, facts) => {
    if (err) {
      console.error(err);
    }
    cb(null, facts);
  });
};

const after = function after(end) {
  if (bot) {
    bot.factSystem.db.close(() => {
      // Kill the globals and remove any fact systems
      bot = null;
      async.each(['mongodb://localhost/superscripttest'], (item, next) => {
        sfacts.clean(item, next);
      }, end);
    });
  } else {
    end();
  }
};

const parse = function parse(file, callback) {
  const fileCache = `${__dirname}/fixtures/cache/${file}.json`;
  fs.exists(fileCache, (exists) => {
    if (!exists) {
      bootstrap((err, factSystem) => {
        parser.parseDirectory(`${__dirname}/fixtures/${file}`, { factSystem }, (err, result) => {
          if (err) {
            return callback(err);
          }
          return callback(null, fileCache, result);
        });
      });
    } else {
      console.log(`Loading cached script from ${fileCache}`);
      let contents = fs.readFileSync(fileCache, 'utf-8');
      contents = JSON.parse(contents);

      bootstrap((err, factSystem) => {
        if (err) {
          return callback(err);
        }
        const checksums = contents.checksums;
        return parser.parseDirectory(`${__dirname}/fixtures/${file}`, {
          factSystem,
          cache: checksums
        }, (err, result) => {
          if (err) {
            return callback(err);
          }
          const results = _.merge(contents, result);
          return callback(null, fileCache, results);
        });
      });
    }
  });
};

const saveToCache = function saveToCache(fileCache, result, callback) {
  fs.exists(`${__dirname}/fixtures/cache`, (exists) => {
    if (!exists) {
      fs.mkdirSync(`${__dirname}/fixtures/cache`);
    }
    return fs.writeFile(fileCache, JSON.stringify(result, null, 4), (err) => {
      if (err) {
        return callback(err);
      }
      return callback();
    });
  });
};

const parseAndSaveToCache = function parseAndSaveToCache(file, callback) {
  parse(file, (err, fileCache, result) => {
    if (err) {
      return callback(err);
    }
    return saveToCache(fileCache, result, (err) => {
      if (err) {
        return callback(err);
      }
      return callback(null, fileCache);
    });
  });
};

const setupBot = function setupBot(fileCache, multitenant, callback) {
  const options = {
    mongoURI: 'mongodb://localhost/superscripttest',
    factSystem: {
      clean: false,
    },
    logPath: null,
    pluginsPath: null,
    importFile: fileCache,
    useMultitenancy: multitenant,
    messagePluginsPath: chs.messagePluginDir,
    conversationTimeout: 1000 * 60 * 60 * 24, // for debug
  };

  return SuperScript.setup(options, (err, botInstance) => {
    if (err) {
      return callback(err);
    }
    bot = botInstance;
    return callback();
  });
};

const before = function before(file, multitenant = false) {
  return (done) => {
    parseAndSaveToCache(file, (err, fileCache) => {
      if (err) {
        return done(err);
      }
      return setupBot(fileCache, multitenant, done);
    });
  };
};

const reply = function botReply(userId, messageString, extraScope) {
  return new Promise((resolve, reject) => {
    bot.reply(userId, messageString, (err, reply) => {
      if (err) {
        reject(err);
        return;
      }

      // if (reply.subReplies.length) {
      //   console.log(`Q:${colorMagenta}%s${colorReset}`, messageString);
      //   console.log(`A:${colorCyan}%o${colorReset}`, reply.subReplies);
      // } else if (reply.string === '') {
      //   console.log(`Q:${colorRed}%s${colorReset}`, messageString);
      // } else {
      //   console.log(`Q:${colorMagenta}%s${colorReset}`, messageString);
      //   console.log(`A:${colorCyan}%s${colorReset}`, reply.string);
      // }

      resolve(reply);
    }, extraScope);
  });
};

const replyString = function replyString(userId, messageString, extraScope) {
  return reply(userId, messageString, extraScope)
    .then((reply) => {
      return reply.string;
    });
};

export default {
  after,
  before,
  getBot,
  reply,
  replyString,
  parseAndSaveToCache,
  setupBot,
};
