'use strict';

const pathToRegexp = require('path-to-regexp');

const jwt = require('jsonwebtoken');
const crypto = require('crypto');
module.exports = {
  timeFormat(time) {
    const d = new Date(time);
    const year = d.getFullYear();
    const month = d.getMonth() + 1;
    const day = d.getDate();
    const hh = d.getHours();
    const mm = d.getMinutes();
    const ss = d.getSeconds();
    let clock = year + '-';
    if (month < 10) {
      clock += '0';
      clock += month + '-';
    }
    if (day < 10) {
      clock += '0';
      clock += day + ' ';
    }
    if (hh < 10) {
      clock += '0';
      clock += hh + ':';
    }
    if (mm < 10) {
      clock += '0';
      clock += mm + ':';
    }
    if (ss < 10) {
      clock += '0';
      clock += ss;
    }
    return (clock);
  },
  //  创建加密token
  createToken(data, secret) {
    return jwt.sign(
      { id: data }, secret,
      {
        expiresIn: 60 * 1,
      });
  },
  //  解密token
  verifyToken(id, secret) {
    return jwt.verify(id, secret, function(err, decoded) {
      if (err) {
        return false;
      }
      return decoded;
    });
  },
  getClientIp(req) {
    try {
      let ip = req.headers['x-real-ip'] ||
        req.headers['x-forwarded-for'] ||
        req.socket.remoteAddress || '';
      if (ip.split(',').length > 0) {
        ip = ip.split(',')[0];
      }
      return ip;
    } catch (e) {
      return '无法获取IP';
    }
  },
  //  创建随机字符
  randomString(len) {
    len = len || 32;
    return crypto.randomBytes(Math.ceil(len / 2)).toString('hex').slice(0, len);
  },
  pathMatchRegexp(regexp, pathname) {
    return pathToRegexp(regexp).exec(pathname);
  },
  cookieToJson(cookie) {
    const cookieArr = cookie.split(';');
    const obj = {};
    cookieArr.forEach(i => {
      const arr = i.split('=');
      obj[arr[0].trim()] = arr[1].trim();
    });
    return obj;
  },
  roleObj: {
    //  改变文字即可实现细粒度的权限功能
    '/user/query': '商户管理',
    '/register': '商户管理',
    '/user/delete/:id': '商户管理',
    '/user/deleteBatch': '商户管理',
    '/user/modify': '商户管理',
  },
  errorCode: {
    200: '服务器成功返回请求的数据。',
    201: '新建或修改数据成功。',
    202: '一个请求已经进入后台排队（异步任务）。',
    204: '删除数据成功。',
    400: '发出的请求有错误，服务器没有进行新建或修改数据的操作。',
    401: '用户没有权限（令牌、用户名、密码错误）。',
    403: '用户得到授权，但是访问是被禁止的。',
    404: '发出的请求针对的是不存在的记录，服务器没有进行操作。',
    406: '请求的格式不可得。',
    410: '请求的资源被永久删除，且不会再得到的。',
    422: '当创建一个对象时，发生一个验证错误。',
    500: '服务器发生错误，请检查服务器。',
    502: '网关错误。',
    503: '服务不可用，服务器暂时过载或维护。',
    504: '网关超时。',
  },

}
