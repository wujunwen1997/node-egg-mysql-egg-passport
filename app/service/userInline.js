'use strict'

const Service = require('egg').Service;

class UserServiveInline extends Service {
  constructor(ctx) {
    super(ctx)
    this.UserInline = ctx.model.UserInline;
    this.ServerResponse = ctx.response.ServerResponse;
  }
  async getUserInlineKey(username) {
    try {
      return await this.UserInline.findOne({ where: { username } });
    } catch (e) {
      this.ctx.logger.error(e.message);
      console.log('获取在线用户失败');
    }
  }
  async DeleteInlineKey(name) {
    try {
      await this.UserInline.destroy({ where: { username: name } });
    } catch (e) {
      this.ctx.logger.error(e.message);
      console.log('删除在线用户失败', e);
    }
  }
  async update(username, key) {
    try {
      await this.UserInline.update({ username, key }, { where: { username } });
    } catch (e) {
      this.ctx.logger.error(e.message);
      console.log('更新用户key失败');
    }
  }
  async register(username, key) {
    try {
      await this.UserInline.create({ username, key });
    } catch (e) {
      this.ctx.logger.error(e.message);
      console.log('创建在线用户失败');
    }
  }
}

module.exports = UserServiveInline;
