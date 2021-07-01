'use strict';
const fse = require('fs-extra');
const path = require('path');
module.exports = {
    up: async (queryInterface, Sequelize) => {
        const data = await fse.readJSON(path.resolve(__dirname + '/data/locations.json'));
        return queryInterface.bulkInsert('locations', data['locations'], {})
    },

    down: (queryInterface, Sequelize) => {
        return queryInterface.bulkDelete('locations', null, {});
    }
};
