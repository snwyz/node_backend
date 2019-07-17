//日志模块
const log4js 	= require('log4js')
const configLog = require('../config/log_config.json')
const logger = log4js.getLogger("index")
log4js.configure(configLog)

module.exports = {
  logger
}