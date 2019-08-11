'use strict'
const crypto = require('crypto');

const Service = require('egg').Service;

class UserServive extends Service {
  constructor(ctx) {
    super(ctx);
    this.UserModel = ctx.model.UserModel;
    this.ServerResponse = ctx.response.ServerResponse;
  }
  async getUserByUsernameAndPassword({ username, password }) {
    const key = this.app.config.passwordKey;
    return await this.UserModel.findOne({ where: { username, password: crypto.createHash('md5').update(password + key).digest('hex') } });
  }
  async getUserById(id) {
    return await this.UserModel.findOne({ where: { id } });
  }
  async getUserByUsername(username) {
    return await this.UserModel.findOne({ where: { username } });
  }
  async getUserByToken(token) {
    return await this.UserModel.findOne({ where: token });
  }
  async query(body) {
    const { pageSize, page, search } = body;
    const s = this.app.Sequelize;
    const Op = s.Op;
    const ps = parseInt(pageSize || 10);
    const pn = parseInt(page ? parseInt(page) - 1 : 0);
    const obj = {
      attributes: [ 'id', 'username', 'role', 'create_time', 'update_time', 'allow_login' ],
      offset: ps * pn, limit: ps,
      order: [[ 'create_time', 'DESC' ]],
    };
    let list = [];
    let total = 0;
    try {
      if (search) {
        list = await this.UserModel.findAll(Object.assign({}, obj, { where: { username: { [Op.like]: `%${search}%` } } }));
        total = await this.UserModel.count(Object.assign({}, obj, { where: { username: { [Op.like]: `%${search}%` } } }));
      } else {
        list = await this.UserModel.findAll(obj);
        total = await this.UserModel.count();
      }
      this.ctx.logger.info('查询用户列表');
      return this.ServerResponse.onSuccess({ list, total });
    } catch (e) {
      this.ctx.logger.error(e.message);
      return this.ServerResponse.onError();
    }
  }
  async register(username, password, role, allowLogin) {
    const hasName = await this.getUserByUsername(username);
    if (hasName) {
      return this.ServerResponse.onError('此用户名已存在');
    }
    try {
      const md5 = crypto.createHash('md5');
      const key = this.app.config.passwordKey;
      const newPas = md5.update(password + key).digest('hex');
      const user = await this.UserModel.create({ username, password: newPas, role: role.join('、'), allowLogin });
      if (!user) {
        return this.ServerResponse.onError();
      }
      return this.ServerResponse.onSuccess();
    } catch (e) {
      this.ctx.logger.error(e.message);
      return this.ServerResponse.onError();
    }
  }
  async destroy(id) {
    const hasName = await this.getUserById(id);
    if (!hasName) {
      return this.ServerResponse.onError('此用户不存在');
    }
    try {
      const user = await this.UserModel.destroy({ where: { id } });
      if (!user) {
        return this.ServerResponse.onError();
      }
      return this.ServerResponse.onSuccess();
    } catch (e) {
      this.ctx.logger.error(e.message);
      return this.ServerResponse.onError();
    }
  }
  async modify(data) {
    const { id, username, password, role, allowLogin } = data;
    const user = await this.getUserById(id);
    if (!user) {
      return this.ServerResponse.onError('此ID不存在');
    }
    const old = await this.getUserById(id);
    const obj = {};
    username && (obj.username = username);
    password && (obj.password = password);
    role && (obj.role = role.join('、'));
    obj.allowLogin = allowLogin || false;
    try {
      const res = await this.UserModel.update(obj, { where: { id }, individualHooks: true });
      if (res[0] === 1) {
        const user = await this.service.userInline.getUserInlineKey(old.dataValues.username);
        if (user !== null && user) {
          const sendMsgKey = { title: '重新登录', content: '您的用户信息被改变，请重新登录' };
          this.ctx.app.io.of('/').to([ user.dataValues.key ]).emit('res', sendMsgKey);
          this.ctx.service.notify.addNotify({ type: 'one', ...sendMsgKey, key: id });
        }
        if (this.ctx.user) {
          const sendMsg = { title: '用户权限改变', content: '管理员:' + this.ctx.user.userName + ',对用户:' + username + ',的信息进行了修改' };
          this.ctx.app.io.of('/').emit('res', sendMsg);
          this.ctx.service.notify.addNotify({ type: 'all', ...sendMsg });
        }
        return this.ServerResponse.onSuccess();
      } else if (res[0] === 0) {
        return this.ServerResponse.onSuccess();
      }
      return this.ServerResponse.onError();
    } catch (e) {
      this.ctx.logger.error(e.message);
      return this.ServerResponse.onError();
    }
  }
  async deleteBatch(data) {
    const s = this.app.Sequelize;
    const Op = s.Op;
    try {
      const res = await this.UserModel.destroy({ where: { id: { [Op.in]: data } } });
      if (res) {
        return this.ServerResponse.onSuccess();
      }
      return this.ServerResponse.onError();
    } catch (e) {
      this.ctx.logger.error(e.message);
      return this.ServerResponse.onError();
    }
  }
}

module.exports = UserServive
