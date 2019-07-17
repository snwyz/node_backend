const express = require('express')
const fs = require('fs')
const https = require('https')
const bodyParser= require('body-parser')
require("body-parser-xml")(bodyParser)
const app	= express()

const config 	= require('../config/conf').get_conf()

const { logger } = require('./logger.js')
const { authRoute } = require('./auth.js')
const { load_plugin, HashMap } = require('./installApi.js')

const startServer = () => {
	app.use(express.json({limit: '50mb'}));
	app.use(express.urlencoded({limit: '50mb'}));
	// BODY用JSON来解析
	app.use(bodyParser.json()); // for parsing application/json
	app.use(bodyParser.urlencoded({extended:true})); // for parsing application/x-www-form-urlencoded
	// 解决微信支付通知回调数据
	app.use(bodyParser.xml({
		limit: "1MB",	// Reject payload bigger than 1 MB
		xmlParseOptions: {
			normalize: true,		// Trim whitespace inside text nodes
			normalizeTags: true,	// Transform tags to lowercase
			explicitArray: false	// Only put nodes in array if >1
		},
		verify: function(req, res, buf, encoding) {
			if(buf && buf.length) {
				req.rawBody = buf.toString(encoding || "utf8");
			}
		}
	}));
	//全局异常监听
	process.on('uncaughtException', function (err) { 
		logger.error('Caught exception: ' + err); 
	}); 
	
	// 设置静态资源路径，所有的HTML、CSS、JS等文件都放在www下即可
	app.use(express.static('www'));
	
// 初始化服务器
const options = {
	key	: fs.readFileSync(config.server.PRIVATE_KEY, 'utf8'),
	cert: fs.readFileSync(config.server.CERTIFICATE, 'utf8')
};

var httpsServer		= https.createServer(options, app);

// 启动HTTP服务器
httpsServer.listen(config.server.HTTPS_PORT, function() {
	logger.info('HTTPS Server is running localhost:' + config.server.HTTPS_PORT);  
});

// 创建https服务器
// httpsServer.listen(config.server.HTTPS_PORT, function() {
// 	logger.info('HTTPS Server is running localhost:' + config.server.HTTPS_PORT);
// });

	app.all('*', function(req, res, next) {
		res.header("Access-Control-Allow-Origin", "*");
		res.header("Access-Control-Allow-Headers", "Content-Type, Content-Length, Authorization, Accept, X-Requested-With, uid, token, aid, akey");
		res.header("Access-Control-Allow-Methods","PUT,POST,GET,DELETE,OPTIONS");
		res.header("X-Powered-By",'3.2.1');
		//logger.debug('request protocol:' + req.protocol);
		// 网页响应
		if (req.params[0] == '/' || req.params[0].indexOf('.html') > -1){
			res.header("Content-Type", "text/html;charset=utf-8");
			next();
			return;
		}
		// 接口响应
		res.header("Content-Type", "application/json;charset=utf-8");
		authRoute(req, res, next, HashMap)
	});
}

// 引入模块API----------------------

var USER		= require('../routes/api_user');		// 用户登陆模块API
// var AGENT		= require('./routes/api_agent');		// 代理商接口
// var DEVICE		= require('./routes/api_device');		// 设备接口
// var SYSTEM		= require('./routes/api_system');		// 系统接口

// 请将需要加载的接口模块，填写到下面数组中
var MODS		= [USER];

// 注册接口日志模块
for(let i=0; i < MODS.length; i++){
	load_plugin(MODS[i], app);
}


module.exports = {
	startServer
}