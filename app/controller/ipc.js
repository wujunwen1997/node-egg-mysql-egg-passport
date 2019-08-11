'use strict';

const Controller = require('./baseController');

class Api extends Controller {
  async index({ request }) {
    const { ctx, service } = this;
    const data = {
      index: service.source.get('index'),
      lastUpdateBy: ctx.app.lastUpdateBy,
    };
    this.check({ status: 0, data }, '获取ipc失败', request, '获取ipc信息');
  }
}

module.exports = Api;
