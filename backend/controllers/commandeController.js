const commandeRepository = require('../repositories/commandeRepository');
const commandeService = require('../services/commandeService');
const AppError = require('../utils/AppError');

// POST /api/commandes - transforme le panier en commande (transaction stock)
async function create(req, res, next) {
  try {
    // Simulation uniquement : aucune donnee bancaire ne doit etre envoyee
    if (req.body.numero_carte || req.body.carte || req.body.cvv) {
      throw new AppError('Paiement simule : ne pas envoyer de donnees bancaires', 400);
    }
    const commande = await commandeService.createCommandeFromPanier(req.user.id);
    res.status(201).json({ message: 'Commande creee, paiement simule accepte', commande });
  } catch (error) { next(error); }
}

// GET /api/commandes - le client voit les siennes, le staff voit tout
async function getAll(req, res, next) {
  try {
    const isStaff = ['gestionnaire', 'administrateur'].includes(req.user.role);
    const commandes = await commandeRepository.findAll(isStaff ? null : req.user.id);
    for (const commande of commandes) {
      commande.items = await commandeRepository.getItems(commande.id);
    }
    res.json(commandes);
  } catch (error) { next(error); }
}

// GET /api/commandes/:id - proprietaire ou staff uniquement
async function getById(req, res, next) {
  try {
    const commande = await commandeRepository.findById(Number(req.params.id));
    if (!commande) throw new AppError('Commande introuvable', 404);
    const isStaff = ['gestionnaire', 'administrateur'].includes(req.user.role);
    if (!isStaff && commande.user_id !== req.user.id) {
      throw new AppError('Cette commande ne vous appartient pas', 403);
    }
    commande.items = await commandeRepository.getItems(commande.id);
    res.json(commande);
  } catch (error) { next(error); }
}

// PUT /api/commandes/:id/status (gestionnaire, administrateur)
async function updateStatus(req, res, next) {
  try {
    const commande = await commandeService.updateStatut(Number(req.params.id), req.body.statut);
    res.json(commande);
  } catch (error) { next(error); }
}

module.exports = { create, getAll, getById, updateStatus };
