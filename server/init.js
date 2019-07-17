const tool		= require('../mcfish/tool');
const redis		= require('../mcfish/redis');
const agent		= require('../mcfish/agent');
const users		= require('../mcfish/user');
const weixin	= require('../mcfish/weixin');
const sms		  = require('../mcfish/sms');
const mysql		= require('../routes/Dao/mysql');
const adMysql	= require('../routes/Dao/adMysql');
const mallMysql	= require('../routes/Dao/mallMysql');

const config 	= require('../config/conf').get_conf();

const _init = (func, conf) => {
  return new Promise((resolve, reject) => {
    // tool.init(config);
  })
}
module.exports = {
  _init
}

// 2，数据库配置
// mysql.init(config.mysql);
// adMysql.init(config.ads_mysql);
// mallMysql.init(config.mall_mysql);
// 3，初始化微信
// weixin.init(config.weixin);

// 4，初始化短信模块
// sms.init(config.alisms);

// 5，初始化REDIS配置信息
// redis.init(config.redis);
