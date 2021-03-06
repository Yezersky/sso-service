/*global GLOBAL, debug */
// load configurations
var configLoader = require('./lib/configLoader.js');
var config = configLoader.loadYaml('config');

// logger
var logger = require('./lib/logger.js')(config.stdLogLevel);
logger.expose(GLOBAL);

// sso API
var sso = require('./lib/sso.js')(config.sso);

// info API
var info = require('./lib/info.js');

// REST server
var express = require('express');
var app = express();

// GET /session/properties：验证一个 Session 是否有效并获取属性
app.get('/session/properties', function (req, res) {
  debug(req.url);
  if (!req.query.sessionid) {
    res.json({ok: false, err: 'Empty session id'});
    return;
  }
  sso.getSessionIdentity(req.query.sessionid, function (err, properties) {
    if (err) {
      res.json({ok: false, err: err.message});
      return;
    }
    res.json({ok: true, properties: properties});
  });
});

// GET /info/student：获取学生的基本信息
app.get('/info/student', function (req, res) {
  debug(req.url);
  if (!req.query.sessionid) {
    res.json({ok: false, err: 'Empty session id'});
    return;
  }
  info.getStudentInfo(req.query.sessionid, function (err, info) {
    if (err) {
      res.json({ok: false, err: err.message});
      return;
    }
    res.json({ok: true, info: info});
  });
});

// GET /info/teacher：获取教师的基本信息
app.get('/info/teacher', function (req, res) {
  debug(req.url);
  if (!req.query.sessionid) {
    res.json({ok: false, err: 'Empty session id'});
    return;
  }
  info.getTeacherInfo(req.query.sessionid, function (err, info) {
    if (err) {
      res.json({ok: false, err: err.message});
      return;
    }
    res.json({ok: true, info: info});
  });
});

app.listen(config.listen.port, config.listen.host, function () {
  debug('SSO Service is listening at %s:%s', config.listen.host, config.listen.port);
});
