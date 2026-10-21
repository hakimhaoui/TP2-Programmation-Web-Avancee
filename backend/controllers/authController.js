const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const userRepository = require('../repositories/userRepository');
const AppError = require('../utils/AppError');

const SALT_ROUNDS = 10;

function createToken(user) {
  return jwt.sign(
    { id: user.id, email: user.email, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRE || '24h' }
  );
}

// POST /api/auth/register - le role est toujours 'client'
async function register(req, res, next) {
  try {
    const { nom, email, mot_de_passe, telephone, adresse } = req.body;
    if (await userRepository.findByEmail(email)) {
      throw new AppError('Un compte existe deja avec cet email', 409);
    }
    const hash = await bcrypt.hash(mot_de_passe, SALT_ROUNDS);
    const user = await userRepository.create({
      nom, email, motDePasseHash: hash, telephone, adresse,
    });
    res.status(201).json({ message: 'Inscription reussie', user, token: createToken(user) });
  } catch (error) { next(error); }
}

// POST /api/auth/login
async function login(req, res, next) {
  try {
    const { email, mot_de_passe } = req.body;
    const user = await userRepository.findByEmail(email);
    if (!user || !(await bcrypt.compare(mot_de_passe, user.mot_de_passe))) {
      throw new AppError('Email ou mot de passe incorrect', 401);
    }
    const { mot_de_passe: _ignore, ...publicUser } = user;
    res.json({ message: 'Connexion reussie', user: publicUser, token: createToken(user) });
  } catch (error) { next(error); }
}

module.exports = { register, login };
