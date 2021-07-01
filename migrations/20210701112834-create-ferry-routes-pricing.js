'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('ferry_routes_pricing', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      name: {
        type: Sequelize.STRING
      },
      start_point: {
        type: Sequelize.STRING
      },
      stop_1: {
        type: Sequelize.STRING
      },
      stop_2: {
        type: Sequelize.STRING
      },
      end_point: {
        type: Sequelize.STRING
      },
      single: {
        type: Sequelize.INTEGER
      },
      return: {
        type: Sequelize.INTEGER
      },
      total: {
        type: Sequelize.INTEGER
      },
      created_at: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.fn('NOW'),
      },
      updated_at: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.fn('NOW'),
      }
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('ferry_routes_pricing');
  }
};