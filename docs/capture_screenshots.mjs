import { createRequire } from 'module';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const require = createRequire(path.join(__dirname, '../frontend/package.json'));
const { chromium } = require('playwright');

const outDir = path.join(__dirname, 'design', 'captures');
fs.mkdirSync(outDir, { recursive: true });

const base = 'http://localhost:5173';

async function login(page, email, password) {
  await page.goto(`${base}/connexion`, { waitUntil: 'networkidle' });
  await page.fill('#email', email);
  await page.fill('#password', password);
  await page.getByRole('button', { name: 'Se connecter' }).click();
  await page.waitForTimeout(1000);
}

async function shot(page, name) {
  const file = path.join(outDir, `${name}.png`);
  await page.screenshot({ path: file, fullPage: true });
  console.log('saved', name);
}

(async () => {
  const browser = await chromium.launch({ headless: true });

  // Desktop captures
  const desk = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await desk.newPage();

  await page.goto(base, { waitUntil: 'networkidle' });
  await shot(page, '01_accueil_desktop');

  await page.goto(`${base}/ouvrages/1`, { waitUntil: 'networkidle' });
  await shot(page, '02_fiche_ouvrage_desktop');

  await page.goto(`${base}/recherche`, { waitUntil: 'networkidle' });
  await shot(page, '03_recherche_desktop');

  await login(page, 'client@librairie.ca', 'Client123!');
  await page.goto(`${base}/ouvrages/2`, { waitUntil: 'networkidle' });
  await page.getByRole('button', { name: 'Ajouter au panier' }).click();
  await page.waitForTimeout(400);
  await page.goto(`${base}/panier`, { waitUntil: 'networkidle' });
  await shot(page, '04_panier_desktop');

  await page.goto(`${base}/listes-cadeaux`, { waitUntil: 'networkidle' });
  await shot(page, '05_listes_cadeaux_desktop');
  await page.fill('#code', 'LC-TEST1234');
  await page.getByRole('button', { name: 'Consulter la liste' }).click();
  await page.waitForTimeout(800);
  await shot(page, '06_liste_ami_desktop');

  await page.evaluate(() => localStorage.clear());
  await login(page, 'admin@librairie.ca', 'Admin123!');
  await page.goto(`${base}/admin`, { waitUntil: 'networkidle' });
  await shot(page, '07_dashboard_admin_desktop');
  await page.goto(`${base}/admin/ouvrages`, { waitUntil: 'networkidle' });
  await shot(page, '08_admin_ouvrages_desktop');
  await page.goto(`${base}/admin/commandes`, { waitUntil: 'networkidle' });
  await shot(page, '09_admin_commandes_desktop');

  // Logo / brand crop from home
  await page.goto(base, { waitUntil: 'networkidle' });
  const logo = page.locator('.brand-mark').first();
  await logo.screenshot({ path: path.join(outDir, 'logo_capture.png') });

  await desk.close();

  // Tablet
  const tab = await browser.newContext({ viewport: { width: 768, height: 1024 } });
  const pTab = await tab.newPage();
  await pTab.goto(base, { waitUntil: 'networkidle' });
  await shot(pTab, '10_accueil_tablette');
  await tab.close();

  // Mobile
  const mob = await browser.newContext({ viewport: { width: 390, height: 844 } });
  const pMob = await mob.newPage();
  await pMob.goto(base, { waitUntil: 'networkidle' });
  await shot(pMob, '11_accueil_mobile');
  await pMob.goto(`${base}/ouvrages/1`, { waitUntil: 'networkidle' });
  await shot(pMob, '12_fiche_mobile');
  await mob.close();

  // Planche tendance via SVG file
  const trend = path.join(__dirname, 'design', 'trendboard', 'planche-tendance.svg');
  const svgPage = await browser.newPage();
  await svgPage.setViewportSize({ width: 1200, height: 800 });
  await svgPage.goto('file:///' + trend.replace(/\\/g, '/'));
  await svgPage.screenshot({ path: path.join(outDir, 'planche_tendance.png') });

  // Wireframe samples
  const wfDesk = path.join(__dirname, 'design', 'wireframes', 'desktop', '01_accueil.svg');
  const wfMob = path.join(__dirname, 'design', 'wireframes', 'mobile', '01_accueil.svg');
  await svgPage.setViewportSize({ width: 1440, height: 1024 });
  await svgPage.goto('file:///' + wfDesk.replace(/\\/g, '/'));
  await svgPage.screenshot({ path: path.join(outDir, 'wireframe_accueil_desktop.png') });
  await svgPage.setViewportSize({ width: 390, height: 844 });
  await svgPage.goto('file:///' + wfMob.replace(/\\/g, '/'));
  await svgPage.screenshot({ path: path.join(outDir, 'wireframe_accueil_mobile.png') });

  // Nouvelle page HTML (après SVG, setContent n'est plus possible)
  const htmlPage = await browser.newPage();

  // Color swatches page
  await htmlPage.setViewportSize({ width: 900, height: 500 });
  await htmlPage.setContent(`<!doctype html><html><body style="margin:0;font-family:Arial">
    <div style="display:flex;gap:24px;padding:40px;background:#F8F5EF;height:100%">
      <div><div style="width:140px;height:140px;background:#214E3B"></div><p>#214E3B</p></div>
      <div><div style="width:140px;height:140px;background:#B45335"></div><p>#B45335</p></div>
      <div><div style="width:140px;height:140px;background:#F8F5EF;border:1px solid #ccc"></div><p>#F8F5EF</p></div>
      <div><div style="width:140px;height:140px;background:#252525"></div><p>#252525</p></div>
      <div><div style="width:140px;height:140px;background:#fff;border:1px solid #ccc"></div><p>#FFFFFF</p></div>
    </div></body></html>`);
  await htmlPage.screenshot({ path: path.join(outDir, 'couleurs_echantillons.png') });

  await htmlPage.setContent(`<!doctype html><html><body style="margin:0;padding:40px;background:#F8F5EF">
    <h1 style="font-family:Georgia,serif;color:#214E3B;font-size:42px">Fraunces — Titre</h1>
    <h2 style="font-family:Georgia,serif;color:#214E3B;font-size:28px">Sous-titre éditorial</h2>
    <p style="font-family:'Segoe UI',Arial,sans-serif;font-size:18px;color:#252525;max-width:640px">
      Source Sans 3 — texte courant lisible pour fiches produit, panier et formulaires.
    </p>
    <button style="background:#214E3B;color:#fff;border:0;padding:12px 20px;border-radius:8px;margin-right:12px">Primaire</button>
    <button style="background:#B45335;color:#fff;border:0;padding:12px 20px;border-radius:8px;margin-right:12px">Secondaire</button>
    <button style="background:transparent;color:#214E3B;border:2px solid #214E3B;padding:10px 18px;border-radius:8px">Outline</button>
  </body></html>`);
  await htmlPage.screenshot({ path: path.join(outDir, 'typo_boutons.png') });

  // Mockup frames: place screenshot inside device-like chrome via HTML
  const homeDesk = path.join(outDir, '01_accueil_desktop.png');
  const homeTab = path.join(outDir, '10_accueil_tablette.png');
  const homeMob = path.join(outDir, '11_accueil_mobile.png');
  await htmlPage.setViewportSize({ width: 1400, height: 900 });
  await htmlPage.setContent(`<!doctype html><html><body style="margin:0;background:#ddd;display:flex;gap:24px;padding:24px;align-items:flex-start">
    <div style="background:#222;padding:12px;border-radius:12px">
      <img src="file:///${homeDesk.replace(/\\/g, '/')}" style="width:720px;display:block;border-radius:4px"/>
      <p style="color:#fff;text-align:center;margin:8px 0 0;font-family:Arial">Ordinateur 1440px</p>
    </div>
  </body></html>`);
  await htmlPage.screenshot({ path: path.join(outDir, 'mockup_ordinateur.png') });

  await htmlPage.setContent(`<!doctype html><html><body style="margin:0;background:#ddd;padding:24px">
    <div style="background:#222;padding:16px;border-radius:18px;display:inline-block">
      <img src="file:///${homeTab.replace(/\\/g, '/')}" style="width:420px;display:block;border-radius:6px"/>
      <p style="color:#fff;text-align:center;margin:8px 0 0;font-family:Arial">Tablette 768px</p>
    </div>
  </body></html>`);
  await htmlPage.screenshot({ path: path.join(outDir, 'mockup_tablette.png') });

  await htmlPage.setContent(`<!doctype html><html><body style="margin:0;background:#ddd;padding:24px">
    <div style="background:#111;padding:18px;border-radius:28px;display:inline-block">
      <img src="file:///${homeMob.replace(/\\/g, '/')}" style="width:280px;display:block;border-radius:18px"/>
      <p style="color:#fff;text-align:center;margin:8px 0 0;font-family:Arial">Téléphone 390px</p>
    </div>
  </body></html>`);
  await htmlPage.screenshot({ path: path.join(outDir, 'mockup_telephone.png') });

  // Arborescence diagram
  await htmlPage.setViewportSize({ width: 1100, height: 700 });
  await htmlPage.setContent(`<!doctype html><html><body style="margin:0;padding:30px;background:#F8F5EF;font-family:Arial">
    <h2 style="color:#214E3B">Arborescence LivresGourmands.net</h2>
    <div style="display:flex;flex-direction:column;gap:18px">
      <div style="background:#214E3B;color:#fff;padding:12px 18px;border-radius:8px;width:fit-content">Accueil</div>
      <div style="display:flex;gap:12px;flex-wrap:wrap;margin-left:30px">
        <div style="background:#fff;border:1px solid #ddd;padding:10px;border-radius:8px">Recherche</div>
        <div style="background:#fff;border:1px solid #ddd;padding:10px;border-radius:8px">Fiche ouvrage</div>
        <div style="background:#fff;border:1px solid #ddd;padding:10px;border-radius:8px">Connexion</div>
        <div style="background:#fff;border:1px solid #ddd;padding:10px;border-radius:8px">Panier (client)</div>
        <div style="background:#fff;border:1px solid #ddd;padding:10px;border-radius:8px">Listes cadeaux / Ami</div>
        <div style="background:#fff;border:1px solid #ddd;padding:10px;border-radius:8px">Admin</div>
      </div>
      <div style="display:flex;gap:12px;flex-wrap:wrap;margin-left:60px">
        <div style="background:#B45335;color:#fff;padding:10px;border-radius:8px">Checkout</div>
        <div style="background:#B45335;color:#fff;padding:10px;border-radius:8px">Confirmation</div>
        <div style="background:#3d6b55;color:#fff;padding:10px;border-radius:8px">Code ami → Liste</div>
        <div style="background:#163528;color:#fff;padding:10px;border-radius:8px">Ouvrages CRUD</div>
        <div style="background:#163528;color:#fff;padding:10px;border-radius:8px">Commandes</div>
      </div>
    </div>
  </body></html>`);
  await htmlPage.screenshot({ path: path.join(outDir, 'arborescence.png') });

  await browser.close();
  console.log('Captures terminées →', outDir);
})();