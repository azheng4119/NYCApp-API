const Sequelize = require('sequelize');
const db = require('../db');

module.exports = db.define('Feeds', {
    trainId: {
        type: Sequelize.STRING,
        allowNull: false,
        required: true
    },
    feedId : {
        type: Sequelize.STRING,
        allowNull: false,
        required: true
    },
}, {
        timestamps: false
    });