// À exécuter sur le poste où l'API et le frontend sont démarrés.
import { chromium } from 'playwright';
import { mkdir } from 'node:fs/promises';
import { resolve } from 'node:path';
const base = process.env.FRONTEND_URL || 'http://localhost:5173';
const api = process.env.API_URL || 'http://localhost:3000';
const response = await fetch(`${api}/api/ouvrages`);
if (!response.ok) throw new Error(`API inaccessible : ${response.status}`);
const data = await response.json();
const books = data.ouvrages;
if (!Array.isArray(books) || !books.length) throw new Error('Catalogue réel vide ou format inattendu');
const dest = resolve('../docs/captures-reelles'); await mkdir(dest, {recursive:true});
const browser = await chromium.launch();
try {
 for (const width of [390,768,1440]) {
  const page = await browser.newPage({viewport:{width,height:900}});
  await page.goto(base); await page.getByRole('heading',{name:'Catalogue',exact:true}).waitFor();
  await page.locator('.book-card').first().waitFor();
  await page.screenshot({path:`${dest}/accueil-${width}.png`,fullPage:true});
  await page.goto(`${base}/ouvrages/${books[0].id}`); await page.getByRole('heading',{name:books[0].titre,exact:true}).first().waitFor();
  await page.screenshot({path:`${dest}/produit-${width}.png`,fullPage:true});
  await page.goto(`${base}/connexion`); await page.getByLabel('Courriel').waitFor();
  await page.screenshot({path:`${dest}/connexion-${width}.png`,fullPage:true});
  await page.goto(`${base}/listes-cadeaux`); await page.getByLabel('Code personnel').waitFor();
  await page.screenshot({path:`${dest}/code-ami-${width}.png`,fullPage:true});
  // Les identifiants sont fournis via variables d'environnement locales, jamais enregistrés ici.
  if (process.env.CAPTURE_CLIENT_EMAIL && process.env.CAPTURE_CLIENT_PASSWORD) {
   await page.goto(`${base}/connexion`); await page.getByLabel('Courriel').fill(process.env.CAPTURE_CLIENT_EMAIL); await page.getByLabel('Mot de passe').fill(process.env.CAPTURE_CLIENT_PASSWORD); await page.getByRole('button',{name:'Se connecter',exact:true}).click(); await page.waitForURL(u=>!u.pathname.includes('/connexion'));
   await page.goto(`${base}/panier`); await page.getByRole('heading',{name:/panier/i}).first().waitFor(); await page.screenshot({path:`${dest}/panier-${width}.png`,fullPage:true});
  }
  await page.close();
  if (process.env.CAPTURE_ADMIN_EMAIL && process.env.CAPTURE_ADMIN_PASSWORD) {
   const admin=await browser.newPage({viewport:{width,height:900}});await admin.goto(`${base}/connexion`);await admin.getByLabel('Courriel').fill(process.env.CAPTURE_ADMIN_EMAIL);await admin.getByLabel('Mot de passe').fill(process.env.CAPTURE_ADMIN_PASSWORD);await admin.getByRole('button',{name:'Se connecter',exact:true}).click();await admin.waitForURL('**/admin');
   for(const [route,name,heading] of [['/admin','admin','Tableau de bord'],['/admin/ouvrages','ouvrages-admin','Ouvrages'],['/admin/commandes','commandes-admin','Commandes']]) {await admin.goto(base+route);await admin.getByRole('heading',{name:heading,exact:true}).waitFor();await admin.screenshot({path:`${dest}/${name}-${width}.png`,fullPage:true});}
   await admin.close();
  }
 }
} finally {await browser.close();}
console.log('Captures enregistrées : '+dest);
