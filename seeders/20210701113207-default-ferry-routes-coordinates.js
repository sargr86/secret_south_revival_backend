'use strict';
const fse = require('fs-extra');
const path = require('path');
module.exports = {
    up: async (queryInterface, Sequelize) => {
        const data = await fse.readJSON(path.resolve(__dirname + '/data/ferry_routes_coordinates.json'));
        let dt = [];
        data.ferry_routes_coordinates.map(async (d) => {
            dt.push(d.coordinates)
        })
        let merged = [].concat.apply([], dt);
        return queryInterface.bulkInsert('ferry_routes_coordinates', merged, {})
    },

    down: (queryInterface, Sequelize) => {
        return queryInterface.bulkDelete('ferry_routes_coordinates', null, {});
    }
};
