'use strict';

module.exports = app => {
  const { STRING, DATE, UUID, UUIDV4, BOOLEAN } = app.Sequelize;

  const UserModel = app.model.define('users', {
    id: {
      type: UUID,
      defaultValue: UUIDV4,
      allowNull: false,
      primaryKey: true,
    },
    username: {
      type: STRING(10),
      allowNull: false,
      unique: true,
    },
    password: {
      type: STRING(255),
      allowNull: false,
    },
    role: {
      type: STRING(255),
      allowNull: true,
    },
    allowLogin: {
      type: BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
    token: {
      type: STRING(255),
      allowNull: true,
    },
    createTime: {
      type: DATE,
      allowNull: false,
      defaultValue: new Date(),
    },
    updateTime: {
      type: DATE,
      allowNull: false,
      defaultValue: new Date(),
    },
  }, {
    timestamps: false,
    tablseName: 'users',
  });

  UserModel.beforeBulkUpdate(user => {
    user.attributes.updateTime = new Date();
    return user;
  });

  return UserModel;
};
