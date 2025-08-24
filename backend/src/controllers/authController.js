const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken"); 
const db = require("../db"); 

function makeToken(user) {
    return jwt.sign(
      { id: user.id, email: user.email },    
      process.env.JWT_SECRET,                
      { expiresIn: "1h" }                    
    );
  }

exports.signup = async (req, res) => {
    const { email, password } = req.body || {};
    if (!email || !password)
      return res.status(400).json({ message: "Champs requis" });
  
    try {
    
      const exists = await db.query("SELECT id FROM users WHERE email = $1", [email]);
      if (exists.rows[0])
        return res.status(400).json({ message: "Email déjà utilisé" });
  
      
      const hashed = await bcrypt.hash(password, 10);
  
      
      const result = await db.query(
        "INSERT INTO users (email, password) VALUES ($1, $2) RETURNING id, email, created_at",
        [email, hashed]
      );
      const user = result.rows[0];
  
      res.status(201).json(user);
    } catch (e) {
      console.error(e);
      res.status(500).json({ message: "Erreur serveur" });
    }
  };
  

exports.login = async (req, res) => {
    const { email, password } = req.body || {};
    if (!email || !password)
      return res.status(400).json({ message: "Champs requis" });
  
    try {
    
      const result = await db.query("SELECT * FROM users WHERE email = $1", [email]);
      const user = result.rows[0];
      if (!user)
        return res.status(400).json({ message: "Utilisateur introuvable" });
  

      const ok = await bcrypt.compare(password, user.password);
      if (!ok)
        return res.status(400).json({ message: "Mot de passe incorrect" });
  
      
      const token = makeToken(user);
      res.json({ token });
    } catch (e) {
      console.error(e);
      res.status(500).json({ message: "Erreur serveur" });
    }
  };
  
  
exports.me = async (req, res) => {
    try {
      const result = await db.query(
        "SELECT id, email, created_at FROM users WHERE id = $1",
        [req.user.id]  
      );
      res.json(result.rows[0] || null);
    } catch (e) {
      console.error(e);
      res.status(500).json({ message: "Erreur serveur" });
    }
  };