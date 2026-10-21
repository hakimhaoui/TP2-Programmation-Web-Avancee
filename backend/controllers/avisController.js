const avisRepository = require('../repositories/avisRepository');
const commentaireRepository = require('../repositories/commentaireRepository');
const ouvrageRepository = require('../repositories/ouvrageRepository');
const AppError = require('../utils/AppError');

// POST /api/ouvrages/:id/avis - seulement si le client a achete l'ouvrage
async function createAvis(req, res, next) {
  try {
    const ouvrageId = Number(req.params.id);
    if (!(await ouvrageRepository.findById(ouvrageId))) {
      throw new AppError('Ouvrage introuvable', 404);
    }
    if (!(await avisRepository.hasPurchased(req.user.id, ouvrageId))) {
      throw new AppError('Vous devez avoir achete cet ouvrage pour donner un avis', 403);
    }
    if (await avisRepository.findByUserAndOuvrage(req.user.id, ouvrageId)) {
      throw new AppError('Vous avez deja donne un avis pour cet ouvrage', 409);
    }
    const avis = await avisRepository.create({
      user_id: req.user.id, ouvrage_id: ouvrageId,
      note: Number(req.body.note), titre: req.body.titre, contenu: req.body.contenu,
    });
    res.status(201).json(avis);
  } catch (error) { next(error); }
}

// POST /api/ouvrages/:id/commentaires - soumis avec valide = false
async function createCommentaire(req, res, next) {
  try {
    const ouvrageId = Number(req.params.id);
    if (!(await ouvrageRepository.findById(ouvrageId))) {
      throw new AppError('Ouvrage introuvable', 404);
    }
    const commentaire = await commentaireRepository.create({
      user_id: req.user.id, ouvrage_id: ouvrageId, contenu: req.body.contenu,
    });
    res.status(201).json({
      message: 'Commentaire soumis, en attente de validation par un editeur',
      commentaire,
    });
  } catch (error) { next(error); }
}

// PUT /api/commentaires/:id/valider (editeur, gestionnaire, administrateur)
// Body : { valide: true } pour valider, { action: "rejeter" } pour rejeter (supprime)
async function validerCommentaire(req, res, next) {
  try {
    const id = Number(req.params.id);
    const commentaire = await commentaireRepository.findById(id);
    if (!commentaire) throw new AppError('Commentaire introuvable', 404);

    if (req.body.action === 'rejeter') {
      await commentaireRepository.remove(id);
      return res.json({ message: 'Commentaire rejete et supprime' });
    }
    const valide = req.body.valide !== undefined ? req.body.valide : true;
    const updated = await commentaireRepository.setValide(id, valide, req.user.id);
    res.json({ message: valide ? 'Commentaire valide' : 'Commentaire invalide', commentaire: updated });
  } catch (error) { next(error); }
}

module.exports = { createAvis, createCommentaire, validerCommentaire };
