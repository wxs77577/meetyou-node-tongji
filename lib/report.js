'use strict'

const _ = require('lodash');
const fetch = require('node-fetch');
const logger = require('./logger').getInstance();

const _url = {
  getSiteList: 'https://api.baidu.com/json/tongji/v1/ReportService/getSiteList',
  getData: 'https://api.baidu.com/json/tongji/v1/ReportService/getData'
}

module.exports = class ReportService {
  constructor(config) {
    this.postHeader = Object.assign({ 'account_type': '1' }, _.pick(config, ['username', 'token']));
    this.reqHeaders = {
      'UUID': _.get(config, 'uuid'),
      'Content-Type': 'data/json;charset=UTF-8'
    }
  }

  setContext(session) {
    Object.assign(this.postHeader, { password: session.st});
    Object.assign(this.reqHeaders, { USERID: session.ucid})
  }

  getSiteList () {
    const postData = { header: this.postHeader, body: null };

    logger.info('[BAIDU_TJ] Getting site list for user', _.get(this.postHeader, 'username'));
    return new Promise((resolve,reject)=>{
        fetch(_url.getSiteList, {
            method: 'POST',
            body: JSON.stringify(postData),
            headers: this.reqHeaders
        })
        .then((res)=>{
            return res.json();
        })
        .then((res)=>{
          const resContent = res;
          const resStatus = _.get(resContent, 'header.status');
          const resData = _.get(resContent, 'body.data');
          if (resStatus === 0 && _.isArray(resData)) {
              logger.info('[BAIDU_TJ] Successfully get site list successfully:', resData);
              const siteList = []
              resData.forEach(data => {
                  if (_.isArray(data.list)) {
                      data.list.forEach(item => {
                          if (item.status === 0) {
                              siteList.push({
                                  site_id: item.site_id,
                                  domain: item.domain,
                                  create_time: item.create_time
                              })
                          }
                      })
                  }
              })
              resolve(siteList);
            } else {
                logger.warn('[BAIDU_TJ] Failed to get site list with res:', resContent);
                resolve(null)
            }
           })
          .catch((err)=>{
              logger.error('[BAIDU_TJ] Failed to get site list with error:', err);
              reject(err);
          })
    })

  }

  getData (params = null) {
      const postData = { header: this.postHeader, body: params };
      logger.info('[BAIDU_TJ] Getting data with params', params);

      return new Promise((resolve,reject)=>{
          fetch(_url.getData, {
              method: 'POST',
              body: JSON.stringify(postData),
              headers: this.reqHeaders
          })
            .then((res)=>{
                resolve(res.json());
            })
            .catch((err)=>{
                logger.error('[BAIDU_TJ] Failed to get data with error:', err);
                reject(err);
            })
      });
      
  }
}
