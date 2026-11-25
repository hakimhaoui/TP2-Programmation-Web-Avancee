/**
 * Enregistrement vidéo de démonstration (parcours UI, sans secrets à l’écran).
 * Usage : npm run demo:video  (API + front démarrés)
 */
import { chromium } from 'playwright';
import { mkdir } from 'node:fs/promises';
import { resolve } from 'node:path';

const base = process.env.FRONTEND_URL || 'http://localhost:5173';
const api = process.env.API_URL || 'http://localhost:3000';
const clientEmail = process.env.CAPTURE_CLIENT_EMAIL || 'client@librairie.ca';
const clientPassword = process.env.CAPTURE_CLIENT_PASSWORD || 'Client123!';
const adminEmail = process.env.CAPTURE_ADMIN_EMAIL || 'admin@librairie.ca';
const adminPassword = process.env.CAPTURE_ADMIN_PASSWORD || 'Admin123!';

const health = await fetch(`${api}/api/health`);
if (!health.ok) throw new Error('API inaccessible');
const booksRes = await fetch(`${api}/api/ouvrages`);
const books = (await booksRes.json()).ouvrages;
if (!books?.length) throw new Error('Catalogue vide');

const outDir = resolve('../docs/demo');
await mkdir(outDir, { recursive: true });

const browser = await chromium.launch({ headless: true });
const context = await browser.newContext({
  viewport: { width: 1440, height: 900 },
  recordVideo: { dir: outDir, size: { width: 1440, height: 900 } },
});
const page = await context.newPage();
const pause = (ms) => page.waitForTimeout(ms);

try {
  // Accueil + design + carrousel
  await page.goto(base);
  await page.getByRole('heading', { name: 'Catalogue', exact: true }).waitFor();
  await page.locator('.book-card img').first().waitFor();
  await pause(2500);
  if (await page.locator('#homeCarousel').count()) {
    await page.locator('#homeCarousel .carousel-control-next').click().catch(() => {});
    await pause(2000);
    await page.locator('#homeCarousel .carousel-control-next').click().catch(() => {});
    await pause(2000);
  }

  // Fiche produit
  await page.goto(`${base}/ouvrages/${books[0].id}`);
  await page.getByRole('heading', { name: books[0].titre, exact: true }).first().waitFor();
  await pause(2500);

  // Connexion client (champs visibles brièvement — compte seed de démo)
  await page.goto(`${base}/connexion`);
  await page.getByLabel('Courriel').fill(clientEmail);
  await page.getByLabel('Mot de passe').fill(clientPassword);
  await page.getByRole('button', { name: 'Se connecter', exact: true }).click();
  await page.waitForURL((u) => !u.pathname.includes('/connexion'));
  await pause(1500);

  // Vérifier absence du bouton Se connecter sur l’accueil une fois connecté
  await page.goto(base);
  await pause(1500);
  const loginBtn = page.getByRole('link', { name: 'Se connecter', exact: true });
  if (await loginBtn.count()) {
    throw new Error('Le bouton « Se connecter » est encore visible alors que l’utilisateur est connecté');
  }

  // Panier
  await page.goto(`${base}/ouvrages/${books[0].id}`);
  await page.getByRole('button', { name: /ajouter au panier/i }).click().catch(() => {});
  await pause(1000);
  await page.goto(`${base}/panier`);
  await page.getByRole('heading', { name: /panier/i }).first().waitFor();
  await pause(2500);

  // Liste cadeaux / ami
  await page.goto(`${base}/listes-cadeaux`);
  await page.getByLabel('Code personnel').fill('LC-TEST1234');
  await pause(1000);
  await page.getByRole('button', { name: /consulter/i }).click().catch(() => {});
  await pause(2500);

  // Déconnexion puis admin
  await page.getByRole('button', { name: /client|déconnexion|@/i }).first().click().catch(() => {});
  await page.getByRole('button', { name: 'Déconnexion', exact: true }).click().catch(() => {});
  await pause(800);

  await page.goto(`${base}/connexion`);
  await page.getByLabel('Courriel').fill(adminEmail);
  await page.getByLabel('Mot de passe').fill(adminPassword);
  await page.getByRole('button', { name: 'Se connecter', exact: true }).click();
  await page.waitForURL('**/admin**');
  await pause(2500);
  await page.goto(`${base}/admin/ouvrages`);
  await page.getByRole('heading', { name: 'Ouvrages', exact: true }).waitFor();
  await pause(2500);
  await page.goto(`${base}/admin/commandes`);
  await page.getByRole('heading', { name: 'Commandes', exact: true }).waitFor();
  await pause(2500);

  // Responsive mobile
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto(base);
  await page.getByRole('heading', { name: 'Catalogue', exact: true }).waitFor();
  await pause(2000);
  const toggler = page.locator('.navbar-toggler');
  if (await toggler.isVisible()) {
    await toggler.click();
    await pause(1500);
  }

  // Tablette
  await page.setViewportSize({ width: 768, height: 900 });
  await page.goto(base);
  await pause(2000);
} finally {
  const video = page.video();
  await context.close();
  await browser.close();
  if (video) {
    const raw = await video.path();
    const dest = resolve(outDir, 'LivresGourmands_Demo_Etape3.webm');
    const { rename, copyFile } = await import('node:fs/promises');
    try {
      await rename(raw, dest);
    } catch {
      await copyFile(raw, dest);
    }
    console.log('Vidéo enregistrée :', dest);
  }
}
