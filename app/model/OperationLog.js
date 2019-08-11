'use strict';

module.exports = app => {
  const { STRING, DATE, BOOLEAN } = app.Sequelize;

  const Operation = app.model.define('operationLog', {
    username: {
      type: STRING(10),
      allowNull: false,
    },
    ip: {
      type: STRING(30),
      allowNull: false,
    },
    operation: {
      type: STRING(50),
      allowNull: false,
    },
    isSuccess: {
      type: BOOLEAN,
      allowNull: false,
    },
    createTime: {
      type: DATE,
      defaultValue: new Date(),
    },
  }, {
    timestamps: false,
    tablseName: 'operationLog',
  });

  return Operation;
};
