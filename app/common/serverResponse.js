'use strict'

const { SUCCESS, ERROR, NEED_LOGIN, CANNOT_LOGIN, NO_AUTH } = require('./responseCode');

module.exports = class ServerResponse {
  constructor(status, msg, data) {
    this.status = status;
    this.msg = msg;
    this.data = data;
  }
  static onSuccess(data) {
    return new ServerResponse(SUCCESS, null, data || null);
  }

  static onError(msg) {
    return new ServerResponse(ERROR, msg, null);
  }
  static needLogin() {
    return new ServerResponse(NEED_LOGIN, '用户登录失效');
  }
  static canNotLogin() {
    return new ServerResponse(CANNOT_LOGIN, '此账户禁止登录');
  }
  static noAuth() {
    return new ServerResponse(NO_AUTH, '用户无此接口权限');
  }
};
