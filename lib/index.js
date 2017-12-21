'use strict'

const _ = require('lodash');
const User = require('./user');
const Report = require('./report');
const logger = require('./logger').getInstance();

module.exports = class TongJi {

  constructor(config) {
    this.user = new User(config);
    this.report = new Report(config);
  }

  login() {
    return new Promise((resolve,reject)=>{
        logger.info('[BAIDU_TJ] Start user login process')
        this.user.preLogin()
            .then((res)=>{
                return this.user.doLogin();
            })
            .then((session)=>{
                if (!session) {
                    throw new Error('[BAIDU_TJ] Cannot retieve user session.')
                }
                this.report.setContext(session);
                resolve(true);
            })
            .catch((err)=>{
                logger.error("[BAIDU_TJ] Prelogin or doLogin failed. Cannot process next step : " +err.toString());
                reject(false);
            })
    })

  }

  logout() {
    return this.user.doLogout()
  }

  getSiteList() {
    return this.report.getSiteList()
  }

  getData(params) {
    return this.report.getData(params)
  }
}
