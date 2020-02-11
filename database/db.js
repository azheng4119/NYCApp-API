require('dotenv').config();
const Sequelize = require('sequelize');


const db = new Sequelize(process.env.RDS_DB_NAME,process.env.RDS_USERNAME,process.env.RDS_PASSWORD,{
    host : process.env.RDS_HOSTNAME,
    dialect : "postgres"
});


module.exports = db;