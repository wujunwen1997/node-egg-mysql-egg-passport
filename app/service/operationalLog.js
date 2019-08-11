'use strict'

const Service = require('egg').Service;

class OperationLog extends Service {
  constructor(ctx) {
    super(ctx)
    this.OperationLog = ctx.model.OperationLog;
    this.ServerResponse = ctx.response.ServerResponse;
  }
  async query(body) {
    const { pageSize, page, search } = body;
    const s = this.app.Sequelize;
    const Op = s.Op;
    const ps = parseInt(pageSize || 10);
    const pn = parseInt(page ? parseInt(page) - 1 : 0);
    const obj = {
      attributes: [ 'username', 'ip', 'create_time', 'operation', 'is_success' ],
      offset: ps * pn, limit: ps,
      order: [[ 'create_time', 'DESC' ]],
    };
    let list = [];
    let total = 0;
    try {
      if (search) {
        const where = {
          [Op.or]: [
            { username: { [Op.like]: `%${search}%` } },
            { ip: { [Op.like]: `%${search}%` } },
          ],
        }
        list = await this.OperationLog.findAll(Object.assign({}, obj, { where }));
        total = await this.OperationLog.count(Object.assign({}, obj, { where }));
      } else {
        list = await this.OperationLog.findAll(obj);
        total = await this.OperationLog.count();
      }
      this.ctx.logger.info('查询操作日志列表');
      return this.ServerResponse.onSuccess({ list, total });
    } catch (e) {
      this.ctx.logger.error(e.message);
      return this.ServerResponse.onError();
    }
  }
  async addOperationLog(data) {
    try {
      await this.OperationLog.create(data);
    } catch (e) {
      this.ctx.logger.error(e.message);
      console.log('添加操作日志失败');
    }
  }
}

module.exports = OperationLog;
