const { DataTypes } = require('sequelize');
const sequelize = require('../db');

const Receipt = sequelize.define('Receipt', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  fileURL: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  size: {
    type: DataTypes.INTEGER, 
    allowNull: false, 
    validate: {
      max: 5 * 1024 * 1024,   //5Mb
    }
  },
  expenseId: {
  type: DataTypes.INTEGER,
  allowNull: false,
},
userId: {
  type: DataTypes.INTEGER,
  allowNull: false,
}

})

module.exports = Receipt;








                            // La suite
// ✅ Ajout des options du modèle (timestamps)
Receipt._timestampAttributes = { createdAt: 'createdAt', updatedAt: 'updatedAt' };

// ✅ Validation manuelle du format (JPG, PNG, PDF)
Receipt.addHook('beforeValidate', (receipt) => {
  if (receipt.fileURL && !/\.(jpg|jpeg|png|pdf)$/i.test(receipt.fileURL)) {
    throw new Error('Format de fichier non supporté. Formats autorisés : JPG, PNG, PDF');
  }
});

// ✅ Surcharge du allowNull de expenseId (optionnel)
Receipt.removeAttribute('expenseId');
Receipt.define('expenseId', {
  type: DataTypes.INTEGER,
  allowNull: true, // facultatif car upload optionnel
});

                          // fin du suite
