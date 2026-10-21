const categorieRepository = require('../repositories/categorieRepository');
const AppError = require('../utils/AppError');

// GET /api/categories (public)
async function getAll(req, res, next) {
  try { res.json(await categorieRepository.findAll()); }
  catch (error) { next(error); }
}

// POST /api/categories (gestionnaire, administrateur)
async function create(req, res, next) {
  try {
    const categorie = await categorieRepository.create(req.body);
    res.status(201).json(categorie);
  } catch (error) { next(error); }
}

// PUT /api/categories/:id (gestionnaire, administrateur)
async function update(req, res, next) {
  try {
    const id = Number(req.params.id);
    const existing = await categorieRepository.findById(id);
    if (!existing) throw new AppError('Categorie introuvable', 404);
    const updated = await categorieRepository.update(id, {
      nom: req.body.nom ?? existing.nom,
      description: req.body.description !== undefined ? req.body.description : existing.description,
    });
    res.json(updated);
  } catch (error) { next(error); }
}

// DELETE /api/categories/:id (gestionnaire, administrateur)
async function remove(req, res, next) {
  try {
    const deleted = await categorieRepository.remove(Number(req.params.id));
    if (!deleted) throw new AppError('Categorie introuvable', 404);
    res.json({ message: 'Categorie supprimee' });
  } catch (error) { next(error); }
}

module.exports = { getAll, create, update, remove };
