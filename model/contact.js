const { DataTypes } = require('sequelize');
const { sequelize } = require('../connect_db'); 
const Contact = sequelize.define('Contact', {
  phoneNumber: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  linkedId: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  linkPrecedence: {
    type: DataTypes.ENUM('primary', 'secondary'),
    allowNull: false,
    defaultValue: 'primary',
  },
}, {
  timestamps: true,
  paranoid: true,
});

module.exports = Contact;
