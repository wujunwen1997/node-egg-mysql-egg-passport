'use strict';

module.exports = app => {
  const { STRING, DATE, UUID, UUIDV4, ENUM } = app.Sequelize;
  const notifys = app.model.define('notifyList', {
    id: {
      type: UUID,
      defaultValue: UUIDV4,
      allowNull: false,
      primaryKey: true,
    },
    type: {
      //  所有人都接收： all, 非全部： one
      type: ENUM('all', 'one'),
      allowNull: false,
    },
    key: {
      type: STRING(100),
      allowNull: true,
    },
    title: {
      type: STRING(50),
      allowNull: false,
    },
    content: {
      type: STRING(200),
      allowNull: false,
    },
    createTime: {
      type: DATE,
      defaultValue: new Date(),
    },
  }, {
    timestamps: false,
    tablseName: 'notifyList',
  });

  return notifys;
};
