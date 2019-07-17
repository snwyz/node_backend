const { logger } = require('./logger.js')
const http       = require('../mcfish/http');
const url 		= require('url');

const authRoute = (req, res, next, HashMap = {}) => {
  // 获取路由信息
  var Url = url.parse(req.url);
  var auth = HashMap[Url.pathname];

  if (auth == undefined) {
    http.send(res, -1, 'unknow method');
    return;
  }
  //日志记录
  var params = null;
  if ('POST' == req.method) {
    params = JSON.stringify(req.body);
  } else {
    params = JSON.stringify(req.query);
  }
  logger.info('请求url:' + req.url);
  logger.info('请求参数:' + params);
  // 无需授权继续往下走
  if (auth == 0) {
    logger.info('\r\n');
    next();
    return;
  }

  // 需要进一步做权限判断
  if (Url.pathname.indexOf('agent') >= 0 || Url.pathname.indexOf('device') >= 0) {
    var aid = req.headers.aid;
    var akey = req.headers.akey;
    logger.info('请求代理商,aid:' + aid + ',请求代理商akey:' + akey);
    logger.info('\r\n');
    agent.check(aid, akey, function (ret, msg, result) {
      if (ret) {
        next();
      } else {
        http.send(res, 103, msg);
      }
    });
  } else {
    var uid = req.headers.uid;
    var token = req.headers.token;
    logger.info('请求用户,uid:' + uid + ',请求用户token:' + token);
    logger.info('\r\n');
    users.check(uid, token, function (ret, msg, result) {
      if (ret) {
        req.headers.openid = result.openid;
        next();
      } else {
        http.send(res, 101, msg);
      }
    });
  }
}

module.exports = {
  authRoute
}
