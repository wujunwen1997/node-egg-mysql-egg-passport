// const { pageSize, page, time, search } = request.body;
// const s = this.app.Sequelize;
// const Op = s.Op;
// const t = this.ctx.helper.timeFormat
// const ps = parseInt(pageSize || 10);
// const pn = parseInt(page ? parseInt(page) - 1 : 0);
// let obj = {
//   attributes: [ 'id', 'username', 'role', 'create_time', 'allow_login' ],
//   offset: ps * pn, limit: ps,
//   order: [[ 'create_time', 'DESC' ]],
// };
// let list = [];
// let total = 0;
// if (time) {
//   obj = {
//     attributes: [ 'id', 'username', 'role', 'create_time', 'allow_login' ],
//     offset: ps * pn, limit: ps,
//     order: [[ 'create_time', 'DESC' ]],
//     where: {
//       create_time: {
//         [Op.lt]: t(time[1]),
//         [Op.gt]: t(time[0]),
//       },
//     },
//   };
// }
// if (time || search) {
//   list = await this.UserModel.findAll(Object.assign(obj));
// } else {
//   list = await this.UserModel.findAll(obj);
//   total = await this.UserModel.count();
// }
// this.serverSuccess({ list, total });
