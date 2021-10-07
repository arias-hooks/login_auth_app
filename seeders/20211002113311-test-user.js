'use strict';

const bcrypt = require('bcrypt');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const now = new Date();
    return queryInterface.bulkInsert(
      'Users',
      [
        {
          name: 'テストA',
          email: 'aaa@example.com',
          password: bcrypt.hashSync('aaa-password', 10),
          createdAt: now,
          updatedAt: now,
        },
        {
          name: 'テストB',
          email: 'bbb@example.com',
          password: bcrypt.hashSync('bbb-password', 10),
          createdAt: now,
          updatedAt: now,
        },
        {
          name: 'テストC',
          email: 'ccc@example.com',
          password: bcrypt.hashSync('ccc-password', 10),
          createdAt: now,
          updatedAt: now,
        },
        {
          name: 'テストD',
          email: 'ddd@example.com',
          password: bcrypt.hashSync('ddd-password', 10),
          createdAt: now,
          updatedAt: now,
        },
        {
          name: 'テストE',
          email: 'eee@example.com',
          password: bcrypt.hashSync('eee-password', 10),
          createdAt: now,
          updatedAt: now,
        },
      ],
      {},
    );
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('Users', null, {});
  },
};
