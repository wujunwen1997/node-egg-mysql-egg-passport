'use strict';

const Controller = require('./baseController');
const path = require('path');
const fs = require('fs');
const sendToWormhole = require('stream-wormhole');
const awaitWriteStream = require('await-stream-ready').write;

class UserController extends Controller {
  constructor(ctx) {
    super(ctx);
    this.UserService = ctx.service.user;
  }
  async add({ request }) {
    const { ctx } = this;
    const stream = await ctx.getFileStream();
    const filename = stream.filename;
    //  上传基础目录
    const uplaodBasePath = '../../app/public/upload/';
    // 生成文件夹
    const dirName = ctx.user.userName;
    const dir = path.join(__dirname, uplaodBasePath, dirName);
    const dirImg = path.join(__dirname, uplaodBasePath, dirName, filename);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir);
    if (fs.existsSync(dirImg)) {
      this.operationLogger(request, '图片上传', false);
      ctx.body = { msg: '此图片名已存在' };
      ctx.status = 400;
      return;
    }
    const res = fs.readdirSync(dir);
    if (res.length > 2) {
      ctx.body = { msg: '最多只能传三张图片' };
      ctx.status = 400;
      return;
    }
    const target = path.join(__dirname, uplaodBasePath, dirName, filename);
    // 写入流
    const writeStream = fs.createWriteStream(target);
    try {
      // 写入文件
      await awaitWriteStream(stream.pipe(writeStream));
      this.operationLogger(request, '图片上传', true);
      ctx.body = { name: filename };
      ctx.status = 200;
    } catch (err) {
      // 必须将上传的文件流消费掉，要不然浏览器响应会卡死
      await sendToWormhole(stream);
      this.operationLogger(request, '图片上传', false);
      ctx.body = { msg: '写入图片失败' };
      ctx.status = 400;
      throw err;
    }
  }
  async addHead({ request }) {
    const { ctx } = this;
    const file = request.files[0];
    const data = fs.readFileSync(file.filepath);
    const base64str = Buffer.from(data, 'binary').toString('base64');
    const bufferData = Buffer.from(base64str, 'base64');
    const uplaodBasePath = '../../app/public/upload/';
    const dirName = ctx.user.userName + 'HeadImg';
    const dir = path.join(__dirname, uplaodBasePath, dirName);
    const src = path.join(__dirname, uplaodBasePath, dirName, file.filename);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir);
    const res = fs.readdirSync(dir);
    if (res.length > 0) fs.unlinkSync(path.join(__dirname, uplaodBasePath, dirName, res[0]));
    try {
      await fs.writeFileSync(src, bufferData);
      ctx.body = { name: file.filename };
      ctx.status = 200;
      this.operationLogger(request, '上传、更新用户头像', true);
    } catch (e) {
      ctx.body = { msg: '写入图片失败' };
      ctx.status = 400;
      this.serverError('上传、更新用户头像失败', request, '上传、更新用户头像');
    }
  }
  async headImg({ request }) {
    const uplaodBasePath = '../../app/public/upload/';
    // 生成文件夹
    const dirName = this.ctx.user.userName + 'HeadImg';
    const dir = path.join(__dirname, uplaodBasePath, dirName);
    if (!fs.existsSync(dir)) {
      this.check({ status: 0, data: [] }, request, '查询用户头像');
    } else {
      const res = fs.readdirSync(dir);
      this.check({ status: 0, data: `http://127.0.0.1:7001/public/upload/${dirName + '/' + res[0]}` }, request, '查询用户头像');
    }
  }
  async query({ request }) {
    const uplaodBasePath = '../../app/public/upload/';
    // 生成文件夹
    const dirName = this.ctx.user.userName;
    const dir = path.join(__dirname, uplaodBasePath, dirName);
    if (!fs.existsSync(dir)) {
      this.check({ status: 0, data: [] }, request, '查询图片列表');
    } else {
      const res = fs.readdirSync(dir);
      const arr = [];
      if (res.length > 0) {
        res.forEach(u => {
          arr.push({
            uid: u,
            name: u,
            status: 'done',
            url: `http://127.0.0.1:7001/public/upload/${dirName + '/' + u}`,
          });
        });
      }
      this.check({ status: 0, data: arr }, request, '查询图片列表');
    }
  }
  async delete({ request }) {
    const { name } = request.body;
    if (!name || name === '') {
      this.serverError('request缺少name', request, '用户图片删除');
    }
    const uplaodBasePath = '../../app/public/upload/';
    // 生成文件夹
    const dirName = this.ctx.user.userName;
    const dir = path.join(__dirname, uplaodBasePath, dirName, name);
    if (!fs.existsSync(dir)) {
      this.serverError('该图片不存在', request, '用户图片删除');
    } else {
      try {
        fs.unlinkSync(dir);
        this.serverSuccess();
        this.operationLogger(request, '删除图片', true);
      } catch (e) {
        this.serverError('删除失败', request, '用户图片删除');
      }
    }
  }
}

module.exports = UserController;
