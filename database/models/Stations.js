const Sequelize = require('sequelize');
const db = require('../db');

module.exports = db.define('Stations', {
    stationId: {
        type: Sequelize.STRING,
        allowNull: false,
        required: true
    },
    stopId: {
        type: Sequelize.STRING,
        allowNull: false,
        required: true
    },
    line : {
        type: Sequelize.STRING,
        allowNull: false,
        required: true
    },
    stopName : {
        type: Sequelize.STRING,
        allowNull: false,
        required: true
    },
    line : {
        type: Sequelize.STRING,
        allowNull: false,
        required: true
    },
    latitude : {
        type: Sequelize.FLOAT,
        allowNull: false,
        required: true
    },
    longitude : {
        type: Sequelize.FLOAT,
        allowNull: false,
        required: true
    },
    dayTimeRoutes : {
        type: Sequelize.STRING,
        allowNull: false,
        required: true
    }
}, {
        timestamps: false
    });