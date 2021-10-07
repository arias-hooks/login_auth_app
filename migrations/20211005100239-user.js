'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    queryInterface.addColumn('Users', 'verificationToken',
      {
        type: Sequelize.STRING,
        after: 'password'
      });

    queryInterface.addColumn('Users', 'verificationTokenExpiredAt',
      {
        type: Sequelize.DATE,
        after: 'verificationToken'
      });
  },

  down: async (queryInterface, Sequelize) => {
    return [
      queryInterface.removeColumn('users', 'verificationToken'),
      queryInterface.removeColumn('users', 'verificationTokenExpiredAt')
    ];
  }
};
