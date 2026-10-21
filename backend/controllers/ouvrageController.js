const ouvrageRepository = require('../repositories/ouvrageRepository');
const categorieRepository = require('../repositories/categorieRepository');
const avisRepository = require('../repositories/avisRepository');
const commentaireRepository = require('../repositories/commentaireRepository');
const AppError = require('../utils/AppError');

// GET /api/ouvrages (public) - uniquement stock > 0
// Filtres : ?search=texte &categorie_id=1 &categorie=Roman &tri=popularite|prix_asc|prix_desc|recent
async function getAll(req, res, next) {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 20;
    const ouvrages = await ouvrageRepository.findPublic({
      search: req.query.search,
      categorie_id: req.query.categorie_id ? Number(req.query.categorie_id) : undefined,
      categorie: req.query.categorie,
      tri: req.query.tri,
      limit,
      offset: (page - 1) * limit,
    });
    res.json({ page, limit, resultats: ouvrages.length, ouvrages });
  } catch (error) { next(error); }
}

// GET /api/ouvrages/:id (public) - avec avis et commentaires valides uniquement
// Affichage public : un ouvrage en rupture (stock = 0) est masque (404),
// sauf pour le personnel (editeur, gestionnaire, administrateur) qui doit le gerer.
async function getById(req, res, next) {
  try {
    const ouvrage = await ouvrageRepository.findById(Number(req.params.id));
    if (!ouvrage) throw new AppError('Ouvrage introuvable', 404);
    const isStaff = req.user && ['editeur', 'gestionnaire', 'administrateur'].includes(req.user.role);
    if (Number(ouvrage.stock) <= 0 && !isStaff) {
      throw new AppError('Ouvrage introuvable', 404);
    }
    ouvrage.avis = await avisRepository.findByOuvrage(ouvrage.id);
    ouvrage.commentaires = await commentaireRepository.findValidesByOuvrage(ouvrage.id);
    res.json(ouvrage);
  } catch (error) { next(error); }
}

async function checkCategorie(categorieId) {
  if (categorieId && !(await categorieRepository.findById(categorieId))) {
    throw new AppError('Categorie introuvable', 400);
  }
}

// POST /api/ouvrages (editeur, gestionnaire, administrateur)
async function create(req, res, next) {
  try {
    await checkCategorie(req.body.categorie_id);
    const ouvrage = await ouvrageRepository.create({ ...req.body, created_by: req.user.id });
    res.status(201).json(ouvrage);
  } catch (error) { next(error); }
}

// PUT /api/ouvrages/:id (editeur, gestionnaire, administrateur)
async function update(req, res, next) {
  try {
    const id = Number(req.params.id);
    if (!(await ouvrageRepository.findById(id))) throw new AppError('Ouvrage introuvable', 404);
    await checkCategorie(req.body.categorie_id);
    const fields = {};
    for (const key of ['titre', 'auteur', 'isbn', 'description', 'prix', 'stock',
                       'categorie_id', 'image_url', 'date_publication']) {
      if (req.body[key] !== undefined) fields[key] = req.body[key];
    }
    res.json(await ouvrageRepository.update(id, fields));
  } catch (error) { next(error); }
}

// DELETE /api/ouvrages/:id (gestionnaire, administrateur)
async function remove(req, res, next) {
  try {
    const deleted = await ouvrageRepository.remove(Number(req.params.id));
    if (!deleted) throw new AppError('Ouvrage introuvable', 404);
    res.json({ message: 'Ouvrage supprime' });
  } catch (error) { next(error); }
}

module.exports = { getAll, getById, create, update, remove };
