const logger = require('log4js').getLogger("index");

/**
 * 加载一个接口模块
 * @param {Object} MOD
 */
const HashMap 	 = {};	

function load_plugin(MOD = {}, app = {}){
	if (!MOD) return
	logger.info('【' + MOD.descript + '】');
	for (var key in MOD.APIS){
		var api = MOD.APIS[key];
		var uri = MOD.mod_name + key;
		if (api.do == null){
			logger.error('register: ' + uri + '\t\t:' + api.method + "\t:" + api.auth + ' [FAILED]');
			continue;
		}
		if (api.method == 'GET'){
			app.get(uri, api.do);
		}else{
			app.post(uri, api.do);
		}
		
		// 存一份HASH
		HashMap[uri] = api.auth;
		logger.info('register: ' + uri + '\t\t:' + api.method + "\t:" + api.auth + ' [OK]');
	}
}

module.exports = {
  load_plugin, HashMap
}