from pathlib import Path
from reportlab.pdfgen import canvas
from reportlab.lib.colors import HexColor, white
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.lib.utils import ImageReader
import cairosvg, io, re, textwrap
ROOT=Path(__file__).resolve().parents[2]; D=ROOT/'docs'; XD=ROOT/'livrables/ADOBE_XD_PRET_IMPORT'; WF=ROOT/'livrables/FIGMA_PRET_IMPORT'
for name,f in [('Body','DejaVuSans.ttf'),('Bold','DejaVuSans-Bold.ttf'),('Title','DejaVuSerif-Bold.ttf')]:pdfmetrics.registerFont(TTFont(name,'/usr/share/fonts/truetype/dejavu/'+f))
W,H=842,595; p='#214E3B'; s='#B45335'; bg='#F8F5EF'; ink='#252525'; mute='#5C5C5C'; line='#DDD6C8'
c=canvas.Canvas(str(D/'Dossier-conception.pdf'),pagesize=(W,H)); c.setTitle('LivresGourmands.net — Dossier de conception'); page=0

def txt(x,y,t,size=12,col=ink,font='Body'):
 c.setFillColor(HexColor(col));c.setFont(font,size);c.drawString(x,H-y,t)
def rect(x,y,w,h,fill,stroke=None,r=0):
 c.setFillColor(HexColor(fill));c.setStrokeColor(HexColor(stroke or fill));c.roundRect(x,H-y-h,w,h,r,stroke=bool(stroke),fill=1)
def paragraph(x,y,t,w=730,size=12,col=ink):
 words=t.split();row='';
 for word in words:
  a=(row+' '+word).strip()
  if pdfmetrics.stringWidth(a,'Body',size)>w and row:txt(x,y,row,size,col);y+=size*1.6;row=word
  else:row=a
 if row:txt(x,y,row,size,col);y+=size*1.6
 return y

def image(path,x,y,w,h):
 if path.suffix=='.svg': data=cairosvg.svg2png(url=str(path),output_width=1000);im=ImageReader(io.BytesIO(data))
 else:im=ImageReader(str(path))
 iw,ih=im.getSize();scale=min(w/iw,h/ih);ww,hh=iw*scale,ih*scale;c.drawImage(im,x+(w-ww)/2,H-y-(h+hh)/2,ww,hh,mask='auto')

def start(section,title,sub=''):
 global page;page+=1;rect(0,0,W,H,bg);rect(0,0,W,10,p);txt(42,38,'LIVRESGOURMANDS.NET  /  '+section.upper(),10,p,'Bold');txt(42,83,title,27,p,'Title');
 if sub:paragraph(42,110,sub,758,11,mute)
 rect(42,548,W-84,1,line);txt(42,570,'Institut Grasset  •  420-WA6-AG  •  Automne 2026',9,mute);txt(767,570,f'{page:02}',10,p,'Bold')
def end():c.showPage()
def card(x,y,w,h,title,body):
 rect(x,y,w,h,'#FFFFFF',line,8);txt(x+15,y+27,title,14,p,'Bold');paragraph(x+15,y+50,body,w-30,11)
# Cover
page+=1;rect(0,0,W,H,bg);rect(0,0,340,H,p);image(ROOT/'frontend/src/assets/logo.svg',40,45,68,68);txt(40,170,'DOSSIER DE',29,'#FFFFFF','Title');txt(40,208,'CONCEPTION',29,'#FFFFFF','Title');txt(40,247,'DU SITE WEB',29,'#FFFFFF','Title');txt(40,295,'LivresGourmands.net',19,'#FFFFFF','Bold');txt(40,340,'Étape 3 — Automne 2026',13,'#FFFFFF');image(ROOT/'frontend/src/assets/hero.png',365,35,435,300);txt(375,385,'Institut Grasset',20,p,'Title');txt(375,415,'Programmation Web avancée 420-WA6-AG',12);txt(375,439,'Enseignante : Kahina Tamazouzt',12);txt(375,473,'Abdelhakim Haoui',13,p,'Bold');txt(375,496,'Mohammed Amine El Marzouki',13,p,'Bold');txt(375,531,'Remise prévue : 26 novembre 2026',11,mute);end()
start('Sommaire','Sommaire');items=[('I. Introduction',3),('II. Cahier des charges',4),('   2.1 Présentation / 2.2 Projet',4),('   2.3 Spécifications / 2.4 Budget',5),('III. Arborescence du site',6),('IV. Wireframes',7),('V. Planche de tendance',14),('VI. Charte graphique',15),('   6.1 Logo / 6.2 Couleurs',15),('   6.3 Typographies / 6.4 Boutons et pictogrammes',16),('VII. Maquettes graphiques',17),('VIII. Mockup',21),('Annexes : preuves et vérifications',22)]
for i,(t,n) in enumerate(items):y=125+i*30;txt(50,y,t,13,p if not t.startswith(' ') else ink,'Bold' if not t.startswith(' ') else 'Body');txt(760,y,str(n),12,p,'Bold');rect(50,y+9,740,0.6,line)
end()
start('I. Introduction','Concevoir, intégrer, vérifier','Une librairie en ligne pédagogique reliée à une API REST existante.')
for i,(t,b) in enumerate([('01  Analyse','Relire les trois documents du cours, le modèle conceptuel et les fonctionnalités déjà développées.'),('02  Conception','Définir les parcours client, ami et administrateur, puis les wireframes et la charte graphique.'),('03  Intégration','Connecter React et Bootstrap à l’API Node.js / Express / MySQL avec Axios.'),('04  Contrôle','Tester les fonctionnalités, les droits, la persistance et le responsive. Distinguer les preuves réelles des maquettes.')]):card(42+(i%2)*382,155+(i//2)*172,366,150,t,b)
end()
start('II. Cahier des charges','Présentation et objectifs')
card(42,132,365,175,'2.1  Présentation','LivresGourmands.net est une librairie en ligne pédagogique, orientée livres culinaires. Elle présente le catalogue, les ouvrages et les services de panier et de listes de cadeaux. Les données de test incluent également des ouvrages non culinaires.')
card(425,132,375,175,'2.2  Objectifs et publics','Clients : découvrir et commander. Amis : consulter une liste par code. Personnel autorisé : administrer le catalogue et les commandes. Le site vise une navigation claire, responsive et accessible.')
card(42,325,365,170,'Périmètre développé','Accueil, recherche, détails, avis, commentaires, connexion, panier local, listes cadeaux, commande simulée et espace d’administration.')
card(425,325,375,170,'Limites','Paiement réel non collecté. Le prototype Adobe XD natif et les captures de l’application connectée restent à finaliser sur le poste de développement.')
end()
start('II. Cahier des charges','Spécifications et budget')
for i,(t,b) in enumerate([('Front-end','React, Vite, Bootstrap, React Router, Axios, Context API et localStorage.'),('Back-end','API Node.js / Express, MySQL, authentification JWT. Port MySQL local signalé : 3307.'),('Navigation et sécurité','Routes protégées, contrôle des rôles côté API, validation du stock et messages utilisateur.'),('Maintenance','Dépôt GitHub, documentation README, tests et procédures de démarrage.')]):card(42+(i%2)*382,130+(i//2)*116,366,102,t,b)
card(42,372,758,135,'2.4  Budget','Projet académique : aucun contrat commercial ni coût d’hébergement confirmé. Les outils sont utilisés selon les accès étudiants disponibles. Aucun montant commercial n’est inventé ; le budget du modèle Bonnevaux ne s’applique pas.')
end()
start('III. Arborescence','Parcours de navigation','Les pages sont organisées par rôle. Les actions de commande restent simulées.')
# diagram rows
roles=[('Public',['Accueil','Recherche','Fiche ouvrage','Connexion']),('Client',['Panier','Livraison / règlement','Confirmation','Mes commandes']),('Ami',['Code personnel','Liste cadeaux','Fiche / panier']),('Admin',['Connexion admin','Dashboard','Ouvrages CRUD','Commandes'])]
for r,(role,nodes) in enumerate(roles):
 y=147+r*96;rect(42,y,110,58,p,None,6);txt(52,y+34,role,14,'#FFFFFF','Bold');n=len(nodes);w=(620-(n-1)*14)/n
 for j,node in enumerate(nodes):
  x=170+j*(w+14);rect(x,y,w,58,'#FFFFFF',line,6);paragraph(x+8,y+24,node,w-16,11,p)
  if j<n-1:txt(x+w+2,y+33,'›',16,s,'Bold')
end()
# 7-13: 3 wireframes pairs each page
Ds=sorted(WF.glob('01*/*.svg')); Ms=sorted(WF.glob('02*/*.svg'))
for j in range(7):
 start('IV. Wireframes',f'Interfaces fonctionnelles {j*3+1:02}–{j*3+3:02}','Représentations basse fidélité : ordinateur (1440 px) et mobile (390 px). Versions locales révisées.')
 for k in range(3):
  idx=j*3+k;x=42+k*255;title=Ds[idx].stem.split('_',2)[2].replace('_',' ');paragraph(x,143,title,244,10,p);rect(x,170,245,337,'#FFFFFF',line,5);image(Ds[idx],x+6,183,155,300);image(Ms[idx],x+164,183,75,300);txt(x+10,496,'Desktop',9,mute);txt(x+174,496,'Mobile',9,mute)
 end()
start('V. Planche de tendance','Un univers éditorial chaleureux','Inspiration : librairie, cuisine, papier crème et matières naturelles. Ressources issues du projet.')
image(ROOT/'frontend/src/assets/hero.png',42,145,340,345);image(ROOT/'frontend/src/assets/logo.svg',425,155,105,105)
for i,(name,color) in enumerate([('Forêt',p),('Terracotta',s),('Papier',bg),('Encre',ink)]):x=425+(i%2)*180;y=286+(i//2)*105;rect(x,y,164,67,color,line,5);txt(x,y+85,name+'  '+color,10,p,'Bold')
paragraph(548,174,'Le logo, les couleurs et la photographie existante du projet constituent la base de la direction artistique.',245,12)
end()
start('VI. Charte graphique','6.1 Logotype et 6.2 Couleurs')
image(ROOT/'frontend/src/assets/logo.svg',55,138,175,175);txt(42,345,'Logo original du projet',14,p,'Bold');paragraph(42,372,'Utilisé dans la navigation et décliné sur fond clair. Préserver la lisibilité et les marges.',210,12)
for i,(name,color) in enumerate([('Principale',p),('Secondaire',s),('Fond',bg),('Texte',ink),('Surface','#FFFFFF'),('Bordure',line)]):x=302+(i%2)*245;y=135+(i//2)*122;rect(x,y,228,70,color,line,6);rgb=tuple(int(color[a:a+2],16) for a in (1,3,5));txt(x,y+89,f'{name}  {color}',12,p,'Bold');txt(x,y+106,'RVB : '+', '.join(map(str,rgb)),10,mute)
end()
start('VI. Charte graphique','6.3 Typographies et 6.4 Boutons')
card(42,132,365,140,'Titres — Fraunces / Georgia','Une famille serif donne une identité éditoriale. Le navigateur utilise Georgia ou Palatino si Fraunces n’est pas disponible.')
card(425,132,375,140,'Texte — Source Sans 3 / Segoe UI','Une famille sans serif favorise la lecture des formulaires, des cartes et des tableaux. Les exemples PDF utilisent des polices locales de substitution.')
for i,(t,col,fg) in enumerate([('Action principale',p,'#FFFFFF'),('Ajouter au panier',s,'#FFFFFF'),('Action secondaire','#FFFFFF',p),('Désactivé','#7A9588','#FFFFFF')]):x=42+(i%2)*240;y=308+(i//2)*65;rect(x,y,220,44,col,p,6);txt(x+12,y+28,t,13,fg,'Bold')
card(540,308,260,150,'Pictogrammes / états','Panier, recherche, compte, menu. Focus visible bleu #0B57D0 ; erreurs et succès accompagnés d’un texte. Contraste et navigation clavier à vérifier en navigateur.')
end()
# 17-20 graphics sets
sets=[('Client — accueil et produit',['Accueil_Client','Fiche_ouvrage_Client','Connexion_Client']),('Client — commande',['Panier_Client','Checkout_Client','Confirmation_Client']),('Ami — liste de cadeaux',['Code_Ami','Liste_Ami']),('Administration',['Dashboard_Admin','Liste_ouvrages_Admin','Formulaire_ouvrage_Admin','Commandes_Admin'])]
for title,names in sets:
 start('VII. Maquettes graphiques',title,'Maquettes haute fidélité redessinées d’après les composants React. Données de démonstration, pas des captures de l’application.')
 for j,name in enumerate(names):
  files=[f for f in XD.glob('0[123]_*/*.svg') if 'Desktop' in f.name and f.stem.endswith(name)]; f=files[0];n=len(names);w=(758-(n-1)*14)/n;x=42+j*(w+14);rect(x,150,w,345,'#FFFFFF',line,6);image(f,x+5,157,w-10,306);paragraph(x+7,480,name.replace('_',' '),w-14,10,p)
 end()
start('VIII. Mockup','Trois formats de consultation','Visualisation conceptuelle des écrans dans des appareils ; le rendu réel du site doit être capturé en environnement local.')
for x,y,w,h,src,label in [(42,170,395,260,next(XD.glob('01_Client/*Desktop*Accueil*')),'Ordinateur'),(465,180,170,250,next(XD.glob('01_Client/*Desktop*Accueil*')),'Tablette (simulation)'),(663,164,110,267,next(XD.glob('01_Client/*Mobile*Accueil*')),'Mobile')]:
 rect(x,y,w,h,'#252525',None,10);rect(x+7,y+9,w-14,h-18,'#FFFFFF',None,3);image(src,x+8,y+12,w-16,h-24);txt(x,y+h+30,label,10,p,'Bold')
end()
start('Annexes','Preuves, liens et limites','État de cette version révisée : livrables locaux et sept tests de logique du panier exécutés.')
card(42,135,365,170,'Vérification technique','7/7 tests Node.js du nouveau panier réussis. Les tests Vitest, Playwright et API antérieurs ne sont pas réexécutés ici : le ZIP ne contient ni serveur, ni base, ni dépendances installées.')
card(425,135,375,170,'Livrables externes','Figma : 42 écrans créés lors de la session précédente. Les SVG locaux révisés ne sont pas synchronisés automatiquement. Adobe XD : SVG et plan de branchement, prototype natif non publié.')
card(42,325,758,160,'Figma et captures','https://www.figma.com/design/nDpTL4OngsUY3hvtL7VznV\nLes captures réelles seront générées sur le poste local via le script Playwright fourni. Remplacer ou compléter les maquettes avec ces captures avant remise, vérifier le partage, publier le prototype Adobe XD et enregistrer la vidéo.')
c.linkURL('https://www.figma.com/design/nDpTL4OngsUY3hvtL7VznV',(42,H-485,800,H-325),relative=0);end();c.save();print('PDF',page,'pages')
