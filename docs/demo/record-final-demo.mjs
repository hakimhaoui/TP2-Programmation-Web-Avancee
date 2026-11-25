/**
 * Vidéo finale ~4 min @ 1080p — scénario SCENARIO_DEMONSTRATION.md
 * - Prototype Figma (pas Adobe XD)
 * - Sous-titres FR via overlay + fichier SRT
 * - Auth injectée (aucun mot de passe affiché)
 * Ne modifie pas React ni la BDD (lecture seule / navigation).
 */
import { chromium } from '../../frontend/node_modules/playwright/index.mjs';
import { mkdir, writeFile, readdir, rename, copyFile } from 'node:fs/promises';
import { resolve, dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '../..');
const OUT = resolve(__dirname, 'raw');
const FRONT = process.env.FRONTEND_URL || 'http://localhost:5173';
const API = process.env.API_URL || 'http://localhost:3000';
const FIGMA_DESIGN = 'https://www.figma.com/design/nDpTL4OngsUY3hvtL7VznV';
const FIGMA_PROTO = 'https://www.figma.com/proto/nDpTL4OngsUY3hvtL7VznV/LivresGourmands.net-%E2%80%93-%C3%89tape-3?node-id=0-1&t=fRl4HC7UrcVBkHtB-1';
const SLIDE_WF = resolve(__dirname, 'slides/wireframes.html');
const SLIDE_PROTO = resolve(__dirname, 'slides/prototype.html');
const PDF = resolve(ROOT, 'docs/Dossier-conception.pdf');
const toFileUrl = (p) => 'file:///' + p.replace(/\\/g, '/');

const CLIENT = { email: 'client@librairie.ca', mot_de_passe: 'Client123!' };
const ADMIN = { email: 'admin@librairie.ca', mot_de_passe: 'Admin123!' };

await mkdir(OUT, { recursive: true });
for (const f of await readdir(OUT)) {
  if (f.endsWith('.webm')) await writeFile(join(OUT, f + '.old'), ''); // keep folder clean later
}

async function loginApi(creds) {
  const res = await fetch(`${API}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(creds),
  });
  if (!res.ok) throw new Error(`Login API ${creds.email}: ${res.status}`);
  return res.json();
}

if (!(await fetch(`${API}/api/health`)).ok) throw new Error('API down');
const books = (await (await fetch(`${API}/api/ouvrages`)).json()).ouvrages;
if (!books?.length) throw new Error('Catalogue vide');
const clientAuth = await loginApi(CLIENT);
const adminAuth = await loginApi(ADMIN);

const cues = [];
let clock = 0;

function srtTime(sec) {
  const h = Math.floor(sec / 3600);
  const m = Math.floor((sec % 3600) / 60);
  const s = Math.floor(sec % 60);
  const ms = Math.floor((sec % 1) * 1000);
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')},${String(ms).padStart(3, '0')}`;
}

async function ensureSub(page) {
  await page.evaluate(() => {
    if (document.getElementById('demo-sub')) return;
    const el = document.createElement('div');
    el.id = 'demo-sub';
    Object.assign(el.style, {
      position: 'fixed', left: '50%', bottom: '40px', transform: 'translateX(-50%)',
      maxWidth: '88%', zIndex: '2147483647', background: 'rgba(22,53,40,0.92)',
      color: '#F8F5EF', padding: '14px 24px', borderRadius: '12px',
      fontFamily: 'Segoe UI, Arial, sans-serif', fontSize: '26px', lineHeight: '1.35',
      textAlign: 'center', boxShadow: '0 10px 28px rgba(0,0,0,.4)', pointerEvents: 'none',
      whiteSpace: 'pre-wrap',
    });
    document.documentElement.appendChild(el);
  });
}

async function say(page, text, seconds) {
  await ensureSub(page);
  await page.evaluate((t) => {
    const el = document.getElementById('demo-sub');
    if (el) { el.textContent = t; el.style.display = t ? 'block' : 'none'; }
  }, text);
  const start = clock;
  clock += seconds;
  cues.push({ start, end: clock, text });
  await page.waitForTimeout(seconds * 1000);
}

async function injectAuth(page, auth) {
  await page.evaluate((payload) => {
    localStorage.setItem('lg_auth', JSON.stringify({ token: payload.token, user: payload.user }));
  }, auth);
}

async function clearAuth(page) {
  await page.evaluate(() => localStorage.removeItem('lg_auth'));
}

const browser = await chromium.launch({ headless: true });
const context = await browser.newContext({
  viewport: { width: 1920, height: 1080 },
  deviceScaleFactor: 1,
  recordVideo: { dir: OUT, size: { width: 1920, height: 1080 } },
});
const page = await context.newPage();

try {
  // 0:00 Présentation — fond plein écran uni (pas de bande centrale)
  await page.setContent(`<!DOCTYPE html><html lang="fr"><head><meta charset="utf-8"><style>
    html,body{margin:0;width:100%;height:100%;background:#214E3B;color:#F8F5EF;
      font-family:Georgia,serif;display:flex;align-items:center;justify-content:center;text-align:center}
    .wrap{max-width:1100px;padding:40px}
    h1{font-size:68px;margin:0 0 18px;font-weight:700}
    .sub{font-size:28px;opacity:.95;margin:10px auto;font-family:"Segoe UI",Arial,sans-serif}
    .pill{margin-top:28px;display:inline-block;border:2px solid #F8F5EF;border-radius:999px;
      padding:10px 18px;font:18px "Segoe UI",Arial,sans-serif}
  </style></head><body><div class="wrap">
    <h1>LivresGourmands.net</h1>
    <p class="sub">Étape 3 — Conception visuelle & intégration front-end / back-end</p>
    <p class="sub">Abdelhakim Haoui · Mohammed Amine El Marzouki</p>
    <p class="sub">420-WA6-AG · Institut Grasset · Automne 2026</p>
    <div class="pill">Démonstration — environ 4 minutes</div>
  </div></body></html>`);
  await say(page, 'Bonjour. Nous sommes Abdelhakim Haoui et Mohammed Amine El Marzouki.\nVoici LivresGourmands.net pour l’étape 3 du cours 420-WA6-AG.', 18);

  // 0:20 Wireframes Figma (aperçu local fiable — le cloud Figma bloque parfois en 403)
  await page.goto(toFileUrl(SLIDE_WF), { waitUntil: 'load', timeout: 30000 });
  await page.waitForSelector('.card img');
  await page.waitForTimeout(1500);
  await say(page, 'Voici nos wireframes Figma : 42 maquettes, versions ordinateur et mobile.\nAccueil, fiche produit, panier et espace administrateur.', 16);
  await page.mouse.wheel(0, 500);
  await page.waitForTimeout(4000);
  await page.mouse.wheel(0, 400);
  await page.waitForTimeout(4000);
  await say(page, `Lien Figma réel : ${FIGMA_DESIGN}`, 8);

  // 0:50 Prototype Figma — 3 parcours (slides locales + URL officielle)
  await page.goto(toFileUrl(SLIDE_PROTO), { waitUntil: 'load', timeout: 30000 });
  await page.waitForSelector('.step img');
  await page.waitForTimeout(1500);
  await say(page, 'Voici le prototype interactif Figma, accepté à la place d’Adobe XD.\n20 écrans, 43 interactions, trois parcours : Client, Ami et Administrateur.', 18);
  await page.mouse.wheel(0, 350);
  await page.waitForTimeout(5000);
  await say(page, `Prototype : ${FIGMA_PROTO}`, 8);

  // 1:20 PDF
  const pdfUrl = 'file:///' + PDF.replace(/\\/g, '/');
  try {
    await page.goto(pdfUrl, { waitUntil: 'load', timeout: 20000 });
  } catch {
    await page.setContent(`<!DOCTYPE html><html lang="fr"><body style="margin:0;background:#F8F5EF;font-family:Segoe UI;padding:64px;color:#252525">
      <h1 style="color:#214E3B;font-size:48px">Dossier de conception PDF</h1>
      <p style="font-size:26px">docs/Dossier-conception.pdf — 21 pages actualisées</p>
      <p style="font-size:22px">Introduction · Cahier des charges · Arborescence · Wireframes · Planche · Charte · Captures React · Mockups</p>
    </body></html>`);
  }
  await say(page, 'Voici le dossier de conception PDF actualisé.\nIl suit le modèle : introduction, cahier des charges, arborescence, wireframes, planche et charte.', 24);

  // 1:45 Accueil React (invité)
  await clearAuth(page);
  await page.goto(FRONT, { waitUntil: 'networkidle', timeout: 60000 });
  await page.getByRole('heading', { name: 'Catalogue', exact: true }).waitFor({ timeout: 30000 });
  await say(page, 'Voici le site React. Le logo LG et la navigation sont visibles.\nLes ouvrages viennent réellement de l’API /api/ouvrages.', 16);
  if (await page.locator('#homeCarousel').count()) {
    await page.locator('#homeCarousel .carousel-control-next').click().catch(() => {});
    await page.waitForTimeout(2200);
    await page.locator('#homeCarousel .carousel-control-next').click().catch(() => {});
    await page.waitForTimeout(2200);
  }
  await say(page, 'On voit les prix, les stocks, les catégories et le carrousel à la une.', 12);

  // 2:20 Fiche + panier + persistance (auth client silencieuse)
  await injectAuth(page, clientAuth);
  await page.goto(`${FRONT}/ouvrages/${books[0].id}`, { waitUntil: 'networkidle' });
  await page.getByRole('heading', { name: books[0].titre, exact: true }).first().waitFor();
  await say(page, 'J’ouvre une fiche produit dynamique : titre, image, prix, stock et avis.', 10);
  const addBtn = page.getByRole('button', { name: /ajouter au panier/i });
  if (await addBtn.count()) {
    await addBtn.first().click();
    await page.waitForTimeout(1200);
  }
  await page.goto(`${FRONT}/panier`, { waitUntil: 'networkidle' });
  await page.getByRole('heading', { name: /panier/i }).first().waitFor();
  await say(page, 'Le panier affiche les articles. Je peux modifier les quantités.', 10);
  const plus = page.getByRole('button', { name: /augmenter/i }).first();
  if (await plus.count()) {
    await plus.click().catch(() => {});
    await page.waitForTimeout(1000);
  }
  await page.reload({ waitUntil: 'networkidle' });
  await page.getByRole('heading', { name: /panier/i }).first().waitFor();
  await say(page, 'Après actualisation, le panier est toujours là grâce à localStorage.', 12);

  // Ami / liste cadeaux
  await page.goto(`${FRONT}/listes-cadeaux`, { waitUntil: 'networkidle' });
  const code = page.getByLabel(/code personnel/i);
  if (await code.count()) {
    await code.fill('LC-TEST1234');
    await page.waitForTimeout(800);
    await page.getByRole('button', { name: /consulter/i }).click().catch(() => {});
    await page.waitForTimeout(2000);
  }
  await say(page, 'Parcours ami : consultation d’une liste cadeaux avec un code personnel.', 10);

  // 2:50 Admin CRUD (auth admin silencieuse, sans destruction)
  await injectAuth(page, adminAuth);
  await page.goto(`${FRONT}/admin`, { waitUntil: 'networkidle' });
  await page.getByRole('heading', { name: /tableau de bord/i }).waitFor({ timeout: 20000 });
  await say(page, 'Je suis connecté en administrateur. Voici le tableau de bord.', 10);
  await page.goto(`${FRONT}/admin/ouvrages`, { waitUntil: 'networkidle' });
  await page.getByRole('heading', { name: 'Ouvrages', exact: true }).waitFor();
  await say(page, 'Liste des ouvrages : lecture dynamique depuis l’API.', 10);
  const addLink = page.getByRole('link', { name: /ajouter|nouveau/i }).first();
  if (await addLink.count()) {
    await addLink.click();
    await page.waitForTimeout(2500);
    await say(page, 'Formulaire d’ajout / modification d’ouvrage (CRUD).', 10);
    await page.goBack().catch(() => page.goto(`${FRONT}/admin/ouvrages`));
    await page.waitForTimeout(1500);
  } else {
    await say(page, 'Gestion des ouvrages (CRUD) disponible dans cet écran.', 8);
  }
  await page.goto(`${FRONT}/admin/commandes`, { waitUntil: 'networkidle' });
  await page.getByRole('heading', { name: 'Commandes', exact: true }).waitFor();
  await say(page, 'Consultation des commandes. Les droits sont aussi vérifiés côté serveur.', 12);

  // 3:30 Responsive
  await page.setViewportSize({ width: 390, height: 844 });
  await clearAuth(page);
  await page.goto(FRONT, { waitUntil: 'networkidle' });
  await page.getByRole('heading', { name: 'Catalogue', exact: true }).waitFor();
  await say(page, 'Sur mobile, le menu hamburger apparaît et les cartes s’empilent correctement.', 12);
  const toggler = page.locator('.navbar-toggler');
  if (await toggler.isVisible()) {
    await toggler.click();
    await page.waitForTimeout(2000);
  }
  await page.setViewportSize({ width: 768, height: 900 });
  await page.goto(FRONT, { waitUntil: 'networkidle' });
  await say(page, 'Version tablette : mise en page responsive.', 8);
  await page.setViewportSize({ width: 1920, height: 1080 });
  await page.goto(FRONT, { waitUntil: 'networkidle' });
  await say(page, 'Et de nouveau en bureau (1920×1080).', 6);

  // 3:50 Conclusion
  await page.setContent(`<!DOCTYPE html><html lang="fr"><head><meta charset="utf-8"><style>
    body{margin:0;height:100vh;display:flex;align-items:center;justify-content:center;text-align:center;
      background:#214E3B;color:#F8F5EF;font-family:Georgia,serif}
    h1{font-size:56px} p{font-size:26px;max-width:900px;margin:12px auto}
  </style></head><body><div>
    <h1>Merci</h1>
    <p>Code GitHub · Dossier PDF · Liens Figma (maquettes + prototype) dans Liens.txt</p>
  </div></body></html>`);
  await say(page, 'Merci. Le code est sur GitHub, le dossier PDF est fourni,\net les liens Figma sont dans Liens.txt.', 12);
} finally {
  const video = page.video();
  await context.close();
  await browser.close();

  let srt = '';
  cues.forEach((c, i) => {
    srt += `${i + 1}\n${srtTime(c.start)} --> ${srtTime(c.end)}\n${c.text}\n\n`;
  });
  await writeFile(resolve(__dirname, 'sous-titres-fr.srt'), srt, 'utf8');
  await writeFile(resolve(__dirname, 'cues.json'), JSON.stringify({ duration: clock, cues }, null, 2), 'utf8');

  if (video) {
    const rawPath = await video.path();
    const dest = resolve(__dirname, 'raw-1080p.webm');
    try { await rename(rawPath, dest); } catch { await copyFile(rawPath, dest); }
    console.log('RAW_VIDEO', dest);
  }
  console.log('DURATION_SEC', clock.toFixed(1));
  console.log('CUES', cues.length);
}
