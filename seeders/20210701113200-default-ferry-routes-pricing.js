'use strict';
const fse = require('fs-extra');
const path = require('path');
module.exports = {
  up: async (queryInterface, Sequelize) => {
    const data = await fse.readJSON(path.resolve(__dirname + '/data/ferry_routes_pricing.json'));
    return queryInterface.bulkInsert('ferry_routes_pricing', data.ferry_routes_pricing, {})
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('ferry_routes_pricing', null, {});
  }
};
