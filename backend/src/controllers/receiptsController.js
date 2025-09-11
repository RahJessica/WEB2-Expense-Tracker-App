const { Receipt } = require('../models/index.js');

// ajout
const path = require('path');
 // fin

exports.createReceipt = async (req, res) => {
  try {
        if (!req.file) return res.status(400).json({ error: 'Aucun fichier reçu' }); // pas là
    const { expenseId } = req.body; // fileURL, size,

    const receipt = await Receipt.create({
      fileURL:req.file.filename, // fileURL, 
      size: req.file.size, // size,
      expenseId,
      userId: req.user.id,
    });

    res.status(201).json(receipt);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getReceipts = async (req, res) => {
  try {
    const receipts = await Receipt.findAll({
      where: { userId: req.user.id },
      order: [['id', 'DESC']],
    });

    res.json(receipts);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.deleteReceipt = async (req, res) => {
  try {
    const receipt = await Receipt.findByPk(req.params.id);
    if (!receipt) return res.status(404).json({ error: 'Receipt not found' });

    if (receipt.userId !== req.user.id) {
      return res.status(403).json({ error: 'Forbidden: not your receipt' });
    }

    await receipt.destroy();
    res.status(204).send();
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};




// download
exports.downloadReceipt = async (req, res) => {
  try {
    const receipt = await Receipt.findByPk(req.params.id);
    if (!receipt) return res.status(404).json({ error: 'Receipt not found' });

    if (receipt.userId !== req.user.id) {
      return res.status(403).json({ error: 'Forbidden: not your receipt' });
    }

    const filePath = path.join(__dirname, '..', 'uploads', receipt.fileURL);
    res.sendFile(filePath);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};