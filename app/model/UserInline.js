'use strict';

module.exports = app => {
  const { STRING } = app.Sequelize;

  return app.model.define('userInline', {
    username: {
      type: STRING(10),
      allowNull: false,
    },
    key: {
      type: STRING(30),
      allowNull: false,
    },
  }, {
    timestamps: false,
    tablseName: 'userInline',
  });
};
