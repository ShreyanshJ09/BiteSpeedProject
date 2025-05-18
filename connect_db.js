const { Sequelize } = require('sequelize');

const databaseFile = './database.sqlite';

const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: databaseFile,
    logging: false 
});

async function connectToDatabase() {
    try {
        await sequelize.authenticate();
        console.log('Connected to SQLite Database');
    } catch (error) {
        console.error('Error connecting to SQLite:', error.message);
    }
}

module.exports = {
    connectToDatabase,
    sequelize
};