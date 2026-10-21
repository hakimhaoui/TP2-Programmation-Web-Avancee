const panierRepository = require('../repositories/panierRepository');
const ouvrageRepository = require('../repositories/ouvrageRepository');
const AppError = require('../utils/AppError');

// Verifie que l'item appartient bien au panier du client connecte
async function getOwnedItem(req) {
  const panier = await panierRepository.getOrCreatePanier(req.user.id);
  const item = await panierRepository.findItemById(Number(req.params.id));
  if (!item) throw new AppError('Article du panier introuvable', 404);
  if (item.panier_id !== panier.id) {
    throw new AppError("Cet article n'appartient pas a votre panier", 403);
  }
  return { panier, item };
}

async function formatPanier(userId) {
  const panier = await panierRepository.getOrCreatePanier(userId);
  const items = await panierRepository.getItems(panier.id);
  const total = items.reduce((sum, i) => sum + Number(i.sous_total), 0);
  return { id: panier.id, user_id: panier.user_id, items, total: Number(total.toFixed(2)) };
}

// GET /api/panier
async function getPanier(req, res, next) {
  try { res.json(await formatPanier(req.user.id)); }
  catch (error) { next(error); }
}

// POST /api/panier/items - verifie le stock disponible
async function addItem(req, res, next) {
  try {
    const quantite = Number(req.body.quantite) || 1;
    const ouvrage = await ouvrageRepository.findById(Number(req.body.ouvrage_id));
    if (!ouvrage) throw new AppError('Ouvrage introuvable', 404);

    const panier = await panierRepository.getOrCreatePanier(req.user.id);
    const existing = await panierRepository.findItemByOuvrage(panier.id, ouvrage.id);
    const quantiteTotale = quantite + (existing ? existing.quantite : 0);
    if (ouvrage.stock < quantiteTotale) {
      throw new AppError(`Stock insuffisant (disponible : ${ouvrage.stock})`, 409);
    }

    if (existing) {
      await panierRepository.updateQuantite(existing.id, quantiteTotale);
    } else {
      await panierRepository.addItem(panier.id, ouvrage.id, quantite, ouvrage.prix);
    }
    await panierRepository.touch(panier.id);
    res.status(201).json(await formatPanier(req.user.id));
  } catch (error) { next(error); }
}

// PUT /api/panier/items/:id
async function updateItem(req, res, next) {
  try {
    const { panier, item } = await getOwnedItem(req);
    const quantite = Number(req.body.quantite);
    const ouvrage = await ouvrageRepository.findById(item.ouvrage_id);
    if (ouvrage.stock < quantite) {
      throw new AppError(`Stock insuffisant (disponible : ${ouvrage.stock})`, 409);
    }
    await panierRepository.updateQuantite(item.id, quantite);
    await panierRepository.touch(panier.id);
    res.json(await formatPanier(req.user.id));
  } catch (error) { next(error); }
}

// DELETE /api/panier/items/:id
async function removeItem(req, res, next) {
  try {
    const { panier, item } = await getOwnedItem(req);
    await panierRepository.removeItem(item.id);
    await panierRepository.touch(panier.id);
    res.json(await formatPanier(req.user.id));
  } catch (error) { next(error); }
}

module.exports = { getPanier, addItem, updateItem, removeItem };
