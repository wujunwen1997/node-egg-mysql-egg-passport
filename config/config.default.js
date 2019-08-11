/* eslint valid-jsdoc: "off" */

'use strict';

const path = require('path');
const os = require('os');
/**
 * @param {Egg.EggAppInfo} appInfo app info
 */
const whitelist = [
  // images
  '.jpg', '.jpeg', // image/jpeg
  '.png', // image/png, image/x-png
  '.gif', // image/gif
  '.bmp', // image/bmp
  '.wbmp', // image/vnd.wap.wbmp
  '.webp',
  '.tif',
  '.psd',
  // text
  '.svg',
  '.js', '.jsx',
  '.json',
  '.css', '.less',
  '.html', '.htm',
  '.xml',
  // tar
  '.zip',
  '.gz', '.tgz', '.gzip',
  // video
  '.mp3',
  '.mp4',
  '.avi',
];
module.exports = appInfo => {
  /**
   * built-in config
   * @type {Egg.EggAppConfig}
   **/
  const config = exports = {};

  // use for cookie sign key, should change to your own and keep security
  config.keys = appInfo.name + '_1556705048929_9106';

  // add your middleware config here
  config.middleware = [];
  config.security = {
    csrf: {
      enable: false,
    },
    domainWhiteList: [ 'http://localhost:5284' ],
  };
  // config.cors = {
  //   origin: 'http://localhost:5284',
  //   allowMethods: 'GET,HEAD,PUT,POST,DELETE,PATCH,OPTIONS',
  //   credentials: true,
  // };
  config.sequelize = {
    dialect: 'mysql',
    host: '127.0.0.1',
    port: 3306,
    database: 'egg',
    username: 'root',
    password: 'a5284267726',
  };
  config.logger = {
    consoleLevel: 'DEBUG',
  };
  config.io = {
    init: { }, // passed to engine.io
    namespace: {
      '/': {
        connectionMiddleware: [ 'connection' ],
        packetMiddleware: [ 'packet' ],
      },
    },
    //  集群模式下
    // redis: {
    //   host: { redis server host },
    //   port: { redis server port },
    //   auth_pass: { redis server password },
    //   db: 0,
    // },
  };
  //  加密密钥
  config.jwtTokenSecret = 'wujunwen';
  config.passwordKey = 'loveyou';
  const userConfig = {
    // myAppName: 'egg',
  };
  config.multipart = {
    mode: 'stream',
    fileModeMatch: /^\/uploadFile$/,
    tmpdir: path.join(os.tmpdir(), 'egg-multipart-tmp', appInfo.name),
    cleanSchedule: {
      // run tmpdir clean job on every day 04:30 am
      cron: '0 30 4 * * *',
    },
    fileSize: '50mb',
    whitelist,
  };
  return {
    ...config,
    ...userConfig,
  };
};
