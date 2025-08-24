const bcrypt = require('bcrypt'); // moyen de hasher les mots de passe
const jwt = require('jsonwebtoken');
const { User } = require('../models/associations.js');

exports.signup = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    const hash = await bcrypt.hash(password, 10);
    const user = await User.create({ username, email, password: hash });
    res.status(201).json({ id: user.id, email: user.email });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ where: { email } });
    if (!user) return res.status(401).json({ message: 'Invalid credentials' });
    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(401).json({ message: 'Invalid credentials' });
    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '7d' }); // création et initialisation du token, avec payload et clé secrète
    res.json({ token });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};