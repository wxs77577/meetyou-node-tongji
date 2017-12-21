'use strict'

const _ = require('lodash');
const fetch = require('node-fetch');
const encrypt = require('./encrypt');
const zlib = require('mz/zlib');
const logger = require('./logger').getInstance();

const _url = 'https://api.baidu.com/sem/common/HolmesLoginService';
const _headers = {
  'account_type': '1',
  'Content-Type': 'data/gzencode and rsa public encrypt;charset=UTF-8'
};

const sendRequest = postData => {
  logger.debug('[BAIDU_TJ] Sending request with url: ' + _url);
  return new Promise((resolve,reject)=>{
      encrypt(postData)
          .then((body)=>{
              return fetch(_url, {
                  method: 'POST',
                  body: body,
                  headers: _headers
              })
            })
        .then(res=> res.buffer())
        .then((bufferRes) => {
           return zlib.gunzip(bufferRes.slice(8))
        })
        .then((rawBody)=>{
           resolve(JSON.parse(rawBody))
        })
        .catch(
          (err)=>{
          logger.error('[BAIDU_TJ] Request faild with error:' + err);
          reject(err);
      });
  })

}

module.exports = class User {
  constructor(config) {
    Object.assign(this, config)
  }

  preLogin() {
    const postData = {
      username: this.username,
      functionName: 'preLogin',
      token: this.token,
      uuid: this.uuid,
      request: { osVersion: 'windows', deviceType: 'pc', clientVersion: '1.0' }
    }
    return new Promise((resolve,reject)=>{
        logger.info('[BAIDU_TJ] Processing preLogin...');
        sendRequest(postData).then(
            (res)=>{
                if (res && res.needAuthCode === false) {
                    logger.info('[BAIDU_TJ] PreLogin completed successfully');
                    resolve(true);
                }
                else{
                    logger.info(res);
                    reject(false);
                }
            }
        ).catch(
            (err)=>{
                logger.error('[BAIDU_TJ] PreLogin failed with unexpected response:', err);
                reject(false)
            }
        )
    });
  }

  doLogin() {
    const postData = {
      username: this.username,
      functionName: 'doLogin',
      token: this.token,
      uuid: this.uuid,
      request: { password: this.password }
    };

    return new Promise((resolve,reject)=>{
        logger.info('[BAIDU_TJ] Processing doLogin...');
        sendRequest(postData)
            .then((res)=>{
              if (res && res.retcode === 0) {
                  logger.info('[BAIDU_TJ] DoLogin completed successfully');
                  this.session = _.pick(res, ['ucid', 'st']);
                  resolve(this.session)
              } else {
                  logger.warn('[BAIDU_TJ] DoLogin failed with unexpected response:', res);
                  reject('DoLogin failed with unexpected response');
              }
            })
            .catch((err)=>{
              logger.error('[BAIDU_TJ] DoLogin failed with unexpected response:', err);
              reject('DoLogin failed with unexpected response');
            })
    });
  }

  doLogout() {
    let postData = {
      username: this.username,
      functionName: 'doLogout',
      token: this.token,
      uuid: this.uuid,
      request: this.session
    };
      return new Promise((resolve,reject)=>{
          logger.info('[BAIDU_TJ] Processing doLogout...')
          sendRequest(postData)
              .then((res)=>{
                  if (res && res.retcode === 0) {
                      logger.info('[BAIDU_TJ] doLogout completed successfully');
                      resolve(true)
                  } else {
                      logger.warn('[BAIDU_TJ] doLogout failed with unexpected response:', res);
                      reject(false)
                  }
              })
              .catch((err)=>{
                  logger.warn('[BAIDU_TJ] doLogout failed with unexpected response:', res);
                  reject(false);
              })
      });
  }
};