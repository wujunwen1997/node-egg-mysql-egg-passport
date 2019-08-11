'use strict'

const Service = require('egg').Service;

class OperationLog extends Service {
  constructor(ctx) {
    super(ctx)
    this.Notify = ctx.model.Notify;
    this.ServerResponse = ctx.response.ServerResponse;
  }
  async query(body) {
    const { pageSize, page, search } = body;
    const s = this.app.Sequelize;
    const Op = s.Op;
    const ps = parseInt(pageSize || 10);
    const pn = parseInt(page ? parseInt(page) - 1 : 0);
    const obj = {
      attributes: [ 'title', 'content', 'create_time', 'id' ],
      offset: ps * pn, limit: ps,
      order: [[ 'create_time', 'DESC' ]],
    };
    let list = [];
    let total = 0;
    try {
      if (search) {
        const where = {
          [Op.or]: [
            { content: { [Op.like]: `%${search}%` } },
            { title: { [Op.like]: `%${search}%` } },
            { type: 'all' },
            { key: this.ctx.user.userId },
          ],
        };
        list = await this.Notify.findAll(Object.assign({}, obj, { where }));
        total = await this.Notify.count(Object.assign({}, obj, { where }));
      } else {
        list = await this.Notify.findAll(Object.assign({}, obj, { where: {
          [Op.or]: [
            { type: 'all' },
            { key: this.ctx.user.userId },
          ],
        },
        }));
        total = await this.Notify.count();
      }
      this.ctx.logger.info('查询系统消息列表');
      return this.ServerResponse.onSuccess({ list, total });
    } catch (e) {
      this.ctx.logger.error(e.message);
      return this.ServerResponse.onError();
    }
  }
  async addNotify(data) {
    try {
      await this.Notify.create(data);
    } catch (e) {
      this.ctx.logger.error(e.message);
      console.log('添加操作日志失败');
    }
  }
  async delete(data) {
    const s = this.app.Sequelize;
    const Op = s.Op;
    try {
      const res = await this.Notify.destroy({ where: { id: { [Op.in]: data } } });
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

module.exports = OperationLog;
