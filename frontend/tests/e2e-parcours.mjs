import { chromium } from 'playwright';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const outPath = path.resolve(__dirname, '../../docs/playwright_results.json');
const base = 'http://localhost:5173';
const results = [];

function log(id, ok, detail) {
  results.push({ id, ok, detail });
  console.log(`[${ok ? 'PASS' : 'FAIL'}] ${id} :: ${detail}`);
}

async function setInput(page, selector, value) {
  await page.fill(selector, value);
}

(async () => {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await context.newPage();
  const consoleErrors = [];
  page.on('console', (msg) => {
    if (msg.type() === 'error') consoleErrors.push(msg.text());
  });

  try {
    // Accueil desktop
    await page.goto(base, { waitUntil: 'networkidle' });
    const cards = await page.locator('.book-card').count();
    log('T06', cards >= 4, `cartes=${cards}`);
    const cats = await page.getByRole('button', { name: 'Science-Fiction' }).count();
    log('T07ui', cats === 1, 'filtre Science-Fiction visible');
    await page.getByRole('button', { name: 'Science-Fiction' }).click();
    await page.waitForTimeout(500);
    const afterFilter = await page.locator('.book-card').count();
    log('T08ui', afterFilter >= 1, `apres filtre SF cartes=${afterFilter}`);

    // Produit
    await page.goto(`${base}/ouvrages/1`, { waitUntil: 'networkidle' });
    log('T09ui', await page.getByRole('heading', { name: 'Le Petit Prince' }).count() === 1, 'fiche produit');
    await page.goto(`${base}/ouvrages/99999`, { waitUntil: 'networkidle' });
    log('T10ui', await page.getByText(/introuvable|épuisé|Erreur/i).count() > 0, 'ouvrage inexistant');

    // Login invalide
    await page.goto(`${base}/connexion`, { waitUntil: 'networkidle' });
    await setInput(page, '#email', 'nobody@test.ca');
    await setInput(page, '#password', 'WrongPass123!');
    await page.getByRole('button', { name: 'Se connecter' }).click();
    await page.waitForTimeout(800);
    log('T23ui', await page.getByRole('alert').count() > 0 || await page.getByText(/incorrect|Erreur/i).count() > 0, 'login invalide message');

    // Login client + panier
    await setInput(page, '#email', 'client@librairie.ca');
    await setInput(page, '#password', 'Client123!');
    await page.getByRole('button', { name: 'Se connecter' }).click();
    await page.waitForURL(/\/$|\/\?/, { timeout: 8000 }).catch(() => {});
    await page.waitForTimeout(500);
    const auth = await page.evaluate(() => {
      try { return JSON.parse(localStorage.getItem('lg_auth') || 'null'); } catch { return null; }
    });
    log('T22ui', auth?.user?.role === 'client', `role=${auth?.user?.role}`);

    await page.goto(`${base}/ouvrages/3`, { waitUntil: 'networkidle' });
    await page.getByRole('button', { name: 'Augmenter la quantité' }).click();
    await page.getByRole('button', { name: 'Ajouter au panier' }).click();
    await page.waitForTimeout(400);
    log('T11ui', await page.getByText(/ajouté au panier/i).count() > 0, 'ajout panier');

    await page.goto(`${base}/panier`, { waitUntil: 'networkidle' });
    log('T15ui', await page.getByText(/Total/i).count() > 0, 'total panier affiché');
    const before = await page.evaluate(() => localStorage.getItem('lg_cart_4'));
    log('T16', !!before && before.includes('ouvrage_id'), 'localStorage panier présent');

    // Persistance refresh
    await page.reload({ waitUntil: 'networkidle' });
    log('T17', await page.locator('table tbody tr').count() >= 1, 'persistance apres refresh');

    // Quantité + suppression
    const qty = page.locator('table input[type="number"]').first();
    if (await qty.count()) {
      await qty.fill('2');
      await page.waitForTimeout(300);
      log('T13ui', true, 'quantite modifiee');
    } else log('T13ui', false, 'pas de champ quantite');

    const delBtn = page.getByRole('button', { name: 'Supprimer' }).first();
    if (await delBtn.count()) {
      await delBtn.click();
      await page.waitForTimeout(300);
      log('T14ui', true, 'suppression cliquee');
    } else log('T14ui', false, 'bouton supprimer absent');

    // Liste cadeaux ami
    await page.goto(`${base}/listes-cadeaux`, { waitUntil: 'networkidle' });
    await setInput(page, '#code', 'LC-TEST1234');
    await page.getByRole('button', { name: 'Consulter la liste' }).click();
    await page.waitForURL(/listes-cadeaux\/LC-TEST1234/, { timeout: 5000 });
    log('T_LISTE_UI', await page.getByText(/Anniversaire|Clean Code|cadeaux/i).count() > 0, 'liste cadeaux');

    // Client refuse admin
    await page.goto(`${base}/admin`, { waitUntil: 'networkidle' });
    await page.waitForTimeout(500);
    log('T27ui', !page.url().includes('/admin') || await page.getByText(/Espace admin/i).count() === 0, `url=${page.url()}`);

    // Logout + admin
    await page.evaluate(() => localStorage.removeItem('lg_auth'));
    await page.goto(`${base}/connexion`, { waitUntil: 'networkidle' });
    await setInput(page, '#email', 'admin@librairie.ca');
    await setInput(page, '#password', 'Admin123!');
    await page.getByRole('button', { name: 'Se connecter' }).click();
    await page.waitForTimeout(1000);
    const adminAuth = await page.evaluate(() => {
      try { return JSON.parse(localStorage.getItem('lg_auth') || 'null'); } catch { return null; }
    });
    log('T28ui', adminAuth?.user?.role === 'administrateur', `role=${adminAuth?.user?.role}`);

    await page.goto(`${base}/admin`, { waitUntil: 'networkidle' });
    log('T28dash', await page.getByText(/Tableau de bord|Espace admin/i).count() > 0, 'dashboard');

    await page.goto(`${base}/admin/ouvrages`, { waitUntil: 'networkidle' });
    log('T_ADMIN_LIST', await page.locator('table tbody tr').count() >= 1, 'liste ouvrages admin');

    // CRUD test book
    await page.goto(`${base}/admin/ouvrages/nouveau`, { waitUntil: 'networkidle' });
    const isbn = `978QA${Date.now().toString().slice(-8)}`;
    await setInput(page, '#titre', 'Ouvrage QA Playwright');
    await setInput(page, '#auteur', 'Auteur QA');
    await setInput(page, '#isbn', isbn);
    await setInput(page, '#prix', '11.11');
    await setInput(page, '#stock', '4');
    await setInput(page, '#description', 'Livre de test temporaire');
    await page.getByRole('button', { name: 'Enregistrer' }).click();
    await page.waitForTimeout(1000);
    log('T29ui', page.url().includes('/admin/ouvrages'), `url=${page.url()}`);
    await page.goto(`${base}/admin/ouvrages`, { waitUntil: 'networkidle' });
    const row = page.locator('tr', { hasText: 'Ouvrage QA Playwright' });
    log('T29ui_list', await row.count() > 0, 'ouvrage QA visible');

    if (await row.count()) {
      await row.getByRole('link', { name: 'Modifier' }).click();
      await page.waitForTimeout(500);
      await setInput(page, '#prix', '22.22');
      await page.getByRole('button', { name: 'Enregistrer' }).click();
      await page.waitForTimeout(800);
      log('T30ui', true, 'modification soumise');

      await page.goto(`${base}/admin/ouvrages`, { waitUntil: 'networkidle' });
      page.once('dialog', async (d) => d.accept());
      const row2 = page.locator('tr', { hasText: 'Ouvrage QA Playwright' });
      if (await row2.count()) {
        await row2.getByRole('button', { name: 'Supprimer' }).click();
        await page.waitForTimeout(800);
        log('T31ui', await page.locator('tr', { hasText: 'Ouvrage QA Playwright' }).count() === 0, 'suppression QA');
      } else log('T31ui', false, 'ligne QA absente avant delete');
    }

    await page.goto(`${base}/admin/commandes`, { waitUntil: 'networkidle' });
    log('T32ui', await page.getByRole('heading', { name: 'Commandes' }).count() === 1, 'page commandes');

    // Responsive checks
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto(base, { waitUntil: 'networkidle' });
    log('T35', await page.getByRole('button', { name: 'Ouvrir le menu' }).count() === 1, 'menu hamburger mobile');

    await page.setViewportSize({ width: 768, height: 1024 });
    await page.goto(base, { waitUntil: 'networkidle' });
    log('T36', await page.getByRole('heading', { name: 'LivresGourmands.net' }).count() >= 1, 'tablette');

    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto(base, { waitUntil: 'networkidle' });
    log('T37', await page.getByRole('link', { name: 'Recherche' }).count() >= 1, 'desktop nav');

    // Admin sans auth
    await context.clearCookies();
    await page.evaluate(() => { localStorage.clear(); sessionStorage.clear(); });
    await page.goto(`${base}/admin`, { waitUntil: 'networkidle' });
    await page.waitForTimeout(500);
    log('T26ui', page.url().includes('/connexion'), `redirect=${page.url()}`);

    // Console : ignorer bruits et erreurs HTTP volontaires des cas négatifs (404/401)
    const realErrors = consoleErrors.filter((e) => {
      if (/favicon|Download the React DevTools/i.test(e)) return false;
      if (/status of 404|status of 401|Unauthorized|Not Found/i.test(e)) return false;
      return true;
    });
    log('T39', realErrors.length === 0, realErrors.slice(0, 3).join(' | ') || 'aucune erreur JS applicative');

  } catch (e) {
    log('E2E_CRASH', false, String(e));
  } finally {
    fs.writeFileSync(outPath, JSON.stringify({ generatedAt: new Date().toISOString(), results }, null, 2), 'utf8');
    const pass = results.filter((r) => r.ok).length;
    const fail = results.filter((r) => !r.ok).length;
    console.log(`SUMMARY Playwright PASS=${pass} FAIL=${fail}`);
    await browser.close();
    process.exit(fail > 0 ? 1 : 0);
  }
})();
