const express = require('express');
const cors = require('cors');

const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const ouvrageRoutes = require('./routes/ouvrageRoutes');
const categorieRoutes = require('./routes/categorieRoutes');
const panierRoutes = require('./routes/panierRoutes');
const commandeRoutes = require('./routes/commandeRoutes');
const listeRoutes = require('./routes/listeRoutes');
const commentaireRoutes = require('./routes/commentaireRoutes');
const { notFound, errorHandler } = require('./middleware/errorHandler');

const app = express();
app.use(cors());
app.use(express.json());

app.get('/', (req, res) => res.json({ message: 'API Librairie - Etape 02' }));
app.get('/api/health', (req, res) => res.json({ statut: 'ok' }));

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/ouvrages', ouvrageRoutes);
app.use('/api/categories', categorieRoutes);
app.use('/api/panier', panierRoutes);
app.use('/api/commandes', commandeRoutes);
app.use('/api/listes', listeRoutes);
app.use('/api/commentaires', commentaireRoutes);

app.use(notFound);
app.use(errorHandler);

module.exports = app;
