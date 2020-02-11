const Sequelize = require('sequelize');
const db = require('../db');

const Favorites = db.define('Favorites', {
    deviceId: {
        type: Sequelize.STRING,
        allowNull: false,
        required: true
    },
    stationId : {
        type: Sequelize.STRING,
        allowNull: false,
        required: true
    },
}, {
        timestamps: false
    });
module.exports = Favorites