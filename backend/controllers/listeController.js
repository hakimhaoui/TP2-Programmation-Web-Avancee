const listeRepository = require('../repositories/listeRepository');
const ouvrageRepository = require('../repositories/ouvrageRepository');
const listeService = require('../services/listeService');
const { generateShareCode } = require('../utils/generateCode');
const AppError = require('../utils/AppError');

async function formatListe(liste) {
  liste.items = await listeRepository.getItems(liste.id);
  return liste;
}

// POST /api/listes - cree une liste avec un code de partage unique
// Items optionnels dans le body : [{ ouvrage_id, quantite }]
async function create(req, res, next) {
  try {
    let liste = null;
    // Reessaie en cas de collision (tres rare) du code genere
    for (let attempt = 0; attempt < 5 && !liste; attempt++) {
      try {
        liste = await listeRepository.create({
          user_id: req.user.id, nom: req.body.nom,
          description: req.body.description, code_partage: generateShareCode(),
        });
      } catch (error) {
        if (error.code !== 'ER_DUP_ENTRY') throw error;
      }
    }
    if (!liste) throw new AppError('Impossible de generer un code de partage unique', 500);

    if (Array.isArray(req.body.items)) {
      for (const item of req.body.items) {
        const ouvrage = await ouvrageRepository.findById(Number(item.ouvrage_id));
        if (!ouvrage) throw new AppError(`Ouvrage ${item.ouvrage_id} introuvable`, 400);
        await listeRepository.addItem(liste.id, ouvrage.id, Number(item.quantite) || 1);
      }
    }
    res.status(201).json(await formatListe(liste));
  } catch (error) { next(error); }
}

// GET /api/listes/:code - consultation publique par code de partage
async function getByCode(req, res, next) {
  try {
    const liste = await listeRepository.findByCode(req.params.code);
    if (!liste) throw new AppError('Liste introuvable', 404);
    const { user_id, ...publicListe } = await formatListe(liste);
    res.json(publicListe);
  } catch (error) { next(error); }
}

// POST /api/listes/:id/items - le proprietaire ajoute un ouvrage
async function addItem(req, res, next) {
  try {
    const liste = await listeRepository.findById(Number(req.params.id));
    if (!liste) throw new AppError('Liste introuvable', 404);
    if (liste.user_id !== req.user.id && req.user.role !== 'administrateur') {
      throw new AppError('Cette liste ne vous appartient pas', 403);
    }
    const ouvrage = await ouvrageRepository.findById(Number(req.body.ouvrage_id));
    if (!ouvrage) throw new AppError('Ouvrage introuvable', 404);
    await listeRepository.addItem(liste.id, ouvrage.id, Number(req.body.quantite) || 1);
    res.status(201).json(await formatListe(liste));
  } catch (error) { next(error); }
}

// POST /api/listes/:id/acheter - achat simule d'un article de la liste
async function acheter(req, res, next) {
  try {
    const liste = await listeRepository.findById(Number(req.params.id));
    if (!liste) throw new AppError('Liste introuvable', 404);
    if (!req.body.item_id && !req.body.ouvrage_id) {
      throw new AppError('Preciser item_id ou ouvrage_id', 400);
    }
    const item = await listeRepository.findItem(
      liste.id, req.body.item_id, req.body.ouvrage_id);
    if (!item) throw new AppError('Article introuvable dans la liste', 404);
    const resultat = await listeService.acheterItem(liste.id, item, req.user.id);
    res.status(201).json({ message: 'Achat simule reussi', ...resultat });
  } catch (error) { next(error); }
}

module.exports = { create, getByCode, addItem, acheter };
