const bcrypt = require('bcrypt');
const userRepository = require('../repositories/userRepository');
const AppError = require('../utils/AppError');

// GET /api/users/me
async function getMe(req, res, next) {
  try {
    const user = await userRepository.findById(req.user.id);
    if (!user) throw new AppError('Utilisateur introuvable', 404);
    res.json(user);
  } catch (error) { next(error); }
}

// GET /api/users (administrateur uniquement, voir routes)
async function getAll(req, res, next) {
  try {
    res.json(await userRepository.findAll());
  } catch (error) { next(error); }
}

// PUT /api/users/:id - soi-meme, ou administrateur
// Seul un administrateur peut changer le role d'un utilisateur.
async function updateUser(req, res, next) {
  try {
    const id = Number(req.params.id);
    const isAdmin = req.user.role === 'administrateur';
    if (req.user.id !== id && !isAdmin) {
      throw new AppError('Vous ne pouvez modifier que votre propre profil', 403);
    }
    const existing = await userRepository.findById(id);
    if (!existing) throw new AppError('Utilisateur introuvable', 404);

    const fields = {};
    for (const key of ['nom', 'email', 'telephone', 'adresse']) {
      if (req.body[key] !== undefined) fields[key] = req.body[key];
    }
    if (req.body.role !== undefined) {
      if (!isAdmin) throw new AppError('Seul un administrateur peut changer un role', 403);
      fields.role = req.body.role;
    }
    if (req.body.mot_de_passe) {
      fields.mot_de_passe = await bcrypt.hash(req.body.mot_de_passe, 10);
    }
    if (fields.email && fields.email !== existing.email) {
      const other = await userRepository.findByEmail(fields.email);
      if (other && other.id !== id) throw new AppError('Cet email est deja utilise', 409);
    }
    res.json(await userRepository.update(id, fields));
  } catch (error) { next(error); }
}

module.exports = { getMe, getAll, updateUser };
