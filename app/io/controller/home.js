'use strict';

module.exports = app => {
  class Controller extends app.Controller {
    async index() {
      const res = await this.ctx.service.userInline.getUserInlineKey(this.ctx.args[0]);
      if (res) {
        await this.ctx.service.userInline.update(this.ctx.args[0], this.ctx.socket.id);
      } else {
        await this.ctx.service.userInline.register(this.ctx.args[0], this.ctx.socket.id);
      }
    }
  }
  return Controller;
};
