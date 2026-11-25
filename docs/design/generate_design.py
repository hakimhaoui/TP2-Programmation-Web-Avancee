from pathlib import Path
from xml.sax.saxutils import escape
import re, base64, math
ROOT=Path(__file__).resolve().parents[2]
XD=ROOT/'livrables/ADOBE_XD_PRET_IMPORT'; WF=ROOT/'livrables/FIGMA_PRET_IMPORT'
P='#214E3B'; S='#B45335'; BG='#F8F5EF'; TXT='#252525'; BORDER='#DDD6C8'
logo=(ROOT/'frontend/src/assets/logo.svg').read_text(); logo_inner=logo[logo.index('>')+1:logo.rindex('</svg>')]
hero=base64.b64encode((ROOT/'frontend/src/assets/hero.png').read_bytes()).decode()
books=['Dune','Clean Code','Le Petit Prince','Histoire du Québec']
titles=['Accueil','Recherche simple','Recherche avancée','Résultats de recherche','Fiche ouvrage','Connexion','Inscription','Mot de passe oublié','Commentaires','Panier','Création liste cadeaux','Saisie code personnel','Consultation cadeaux','Livraison et règlement','Paiement externe','Confirmation achat','Mes commandes','Dashboard admin','Liste ouvrages admin','Ajout / modification ouvrage','Commandes admin']
class Screen:
 def __init__(self,w,gray=False):
  self.w=w;self.m=w<700;self.gray=gray;self.p='#444444' if gray else P;self.s='#777777' if gray else S;self.bg='#F4F4F4' if gray else BG;self.b='#BBBBBB' if gray else BORDER;self.a=[];self.pad=16 if self.m else 72;self.c=w-2*self.pad;self.y=94 if self.m else 114
 def rect(self,x,y,w,h,fill='white',stroke='none',r=8): self.a.append(f'<rect x="{x}" y="{y}" width="{w}" height="{h}" rx="{r}" fill="{fill}" stroke="{stroke}"/>')
 def text(self,x,y,t,size=18,color=TXT,bold=False,serif=False):
  self.a.append(f'<text x="{x}" y="{y}" font-family="{"Georgia" if serif and not self.gray else "Arial"}" font-size="{size}" font-weight="{"bold" if bold else "normal"}" fill="{color}">{escape(str(t))}</text>')
 def wrap(self,x,y,t,w,size=16,color=TXT):
  import textwrap
  for i,line in enumerate(textwrap.wrap(t,max(12,int(w/(size*.55))))): self.text(x,y+i*(size+5),line,size,color)
 def button(self,t,x=None,y=None,w=None,secondary=False,outline=False):
  x=self.pad if x is None else x;y=self.y if y is None else y;w=min(self.c, max(130,len(t)*8+28)) if w is None else w
  self.rect(x,y,w,44,'white' if outline else self.s if secondary else self.p,self.p);self.text(x+12,y+28,t,14,self.p if outline else 'white',True)
 def field(self,t,val='',x=None,y=None,w=None):
  x=self.pad if x is None else x;y=self.y if y is None else y;w=self.c if w is None else w;self.text(x,y+15,t,15,TXT,True);self.rect(x,y+24,w,43,'white',self.b);self.text(x+12,y+51,val,15,'#666666')
 def heading(self,t,sub=None):
  self.text(self.pad,self.y+30,t,24 if self.m else 38,self.p,True,True);self.y+=53
  if sub:self.wrap(self.pad,self.y,sub,self.c,14,'#555555');self.y+=35
 def cover(self,x,y,w,h,title):
  self.rect(x,y,w,h,'#D6D6D6' if self.gray else '#E6DFCF','none',4)
  if self.gray:
   self.a.append(f'<path d="M{x} {y} L{x+w} {y+h} M{x+w} {y} L{x} {y+h}" stroke="#B0B0B0"/>')
  else:
   bw=min(w*.57,110);bx=x+(w-bw)/2;by=y+h*.12;bh=h*.75;self.rect(bx,by,bw,bh,self.p,'none',2);self.rect(bx+6,by+5,bw-12,bh-10,'none','#D4C5A5',1);self.wrap(bx+10,by+23,title,bw-18,11,'white');self.a.append(f'<path d="M{bx+12} {by+bh-26} h{bw-24}" stroke="#D4C5A5" stroke-width="2"/>')
 def cards(self,names):
  cols=2 if self.m else 4;gap=12 if self.m else 22;w=(self.c-(cols-1)*gap)/cols;h=205 if self.m else 285
  for i,t in enumerate(names):
   x=self.pad+(i%cols)*(w+gap);y=self.y+(i//cols)*(h+gap);self.rect(x,y,w,h,'white',self.b);self.cover(x+10,y+10,w-20,h-85,t);self.wrap(x+10,y+h-60,t,w-20,13 if self.m else 19,self.p);self.text(x+10,y+h-22,'Prix • Stock',12 if self.m else 15,'#555555')
  self.y+=math.ceil(len(names)/cols)*(h+gap)+15
 def row(self,lines,action=None):
  h=100 if self.m else 85;self.rect(self.pad,self.y,self.c,h,'white',self.b)
  for i,t in enumerate(lines):self.text(self.pad+12,self.y+22+i*21,t,14 if self.m else 17,self.p if i==0 else TXT,i==0)
  if action:self.button(action,self.pad+self.c-(125 if self.m else 180),self.y+38,115 if self.m else 166,outline=True)
  self.y+=h+12
 def form(self,fields,action,extra=None):
  w=self.c if self.m else min(640,self.c);x=(self.w-w)/2;start=self.y;self.rect(x-0,start-8,w,len(fields)*82+104+(32 if extra else 0),'white',self.b)
  for i,(label,val) in enumerate(fields):self.field(label,val,x+16,start+i*82,w-32)
  self.y=start+len(fields)*82+8;self.button(action,x+16,self.y,min(w-32,max(180,len(action)*8+25)));self.y+=60
  if extra:self.text(x+16,self.y,extra,13,self.p);self.y+=40
  self.y+=24
 def header(self):
  self.rect(0,0,self.w,78,'white',self.b,0)
  if self.gray:self.rect(self.pad,18,40,40,'#CFCFCF','#999999')
  else:self.a.append(f'<svg x="{self.pad}" y="18" width="42" height="42" viewBox="0 0 96 96">{logo_inner}</svg>')
  self.text(self.pad+51,37,'LivresGourmands.net',16 if self.m else 23,self.p,True,True);self.text(self.pad+51,54,'Librairie culinaire',11 if self.m else 14,'#666666')
  if self.m:self.text(self.w-56,45,'Menu',13,self.p,True)
  else:
   for i,t in enumerate(['Accueil','Recherche','Listes cadeaux','Panier','Connexion']):self.text(self.w-610+i*112,46,t,16,self.p)
 def finish(self):
  h=max(844 if self.m else 1024,self.y+82);self.rect(0,h-54,self.w,54,'white',self.b,0);self.text(self.pad,h-22,'LivresGourmands.net  •  Projet académique',12,'#666666');return f'<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="{self.w}" height="{h}" viewBox="0 0 {self.w} {h}"><rect width="100%" height="100%" fill="{self.bg}"/>'+''.join(self.a)+'</svg>'

def screen(i,w,gray=False,state=''):
 q=Screen(w,gray);q.header();p=q.pad;c=q.c;m=q.m
 if i==1:
  h=190 if m else 280;q.rect(p,q.y,c,h,q.p)
  if not gray and not m:q.a.append(f'<image x="{p+c-260}" y="{q.y+10}" width="240" height="260" xlink:href="data:image/png;base64,{hero}" preserveAspectRatio="xMidYMid meet"/>')
  q.text(p+16,q.y+35,'LIBRAIRIE CULINAIRE EN LIGNE',12,'white',True);q.text(p+16,q.y+75,'LivresGourmands.net',24 if m else 45,'white',True,True);q.wrap(p+16,q.y+105,'Explorez les ouvrages et préparez votre prochaine commande.',c-35 if m else c-350,15,'white');q.button('Voir le catalogue',p+16,q.y+h-62,168,True);q.y+=h+22
  q.field('Recherche','Titre, auteur…',w=c if m else c*.65);q.y+=84;q.text(p,q.y+15,'Catégories : Toutes • Choisir une catégorie',14,q.p,True);q.y+=38
  q.row(['À la une : Dune','Sélection du catalogue'], 'Voir la fiche');q.heading('Catalogue');q.cards(books)
 elif i in (2,3,4):
  q.heading(titles[i-1]);q.field('Recherche','Titre ou auteur');q.y+=80
  if i==3:q.field('Catégorie','Toutes');q.y+=80;q.field('Prix min. / max.','');q.y+=80
  q.button('Rechercher');q.y+=64;q.cards(books)
 elif i==5:
  q.heading('Dune','Accueil / Ouvrages / Dune');h=150 if m else 310;bw=110 if m else 300;q.cover(p,q.y,bw,h,'Dune');x=p+bw+16;q.text(x,q.y+32,'Dune',24 if m else 40,q.p,True,True);q.text(x,q.y+60,'Auteur • Catégorie',13);q.text(x,q.y+85,'Prix : selon API',14,q.s,True);q.text(x,q.y+109,'Stock : disponible',13);q.y+=h+22;q.heading('Description');q.wrap(p,q.y,'Description affichée depuis les données de l’ouvrage.',c,15);q.y+=35;q.text(p,q.y+20,'Quantité   −   '+('2' if state=='quantity' else '1')+'   +',18,q.p,True);q.y+=40;q.button('Ajouter au panier',secondary=True);q.y+=64;q.heading('Avis et commentaires');q.row(['Avis des lecteurs','Note et commentaires selon API']);
 elif i==6:q.heading('Connexion');q.form([('Courriel',''),('Mot de passe','••••••••')],'Se connecter','S’inscrire • Mot de passe oublié')
 elif i==7:q.heading('Inscription');q.form([('Nom',''),('Courriel',''),('Mot de passe','')],'S’inscrire')
 elif i==8:q.heading('Mot de passe oublié');q.wrap(p,q.y,'Contactez le support selon la procédure du site.',c);q.y+=50;q.button('Retour à la connexion');q.y+=60
 elif i==9:q.heading('Avis et commentaires');q.row(['Note moyenne','Selon les avis de l’API']);q.row(['Commentaire','Contenu validé par le site']);q.form([('Votre commentaire','')],'Publier')
 elif i==10:
  q.heading('Panier');q.text(p,q.y+16,'Ouvrage   /   Prix   /   Quantité   /   Sous-total',14,q.p,True);q.y+=30
  if state!='empty':q.row(['Dune  •  Prix selon API','Quantité : −  '+('2' if state=='quantity' else '1')+'  +','Sous-total recalculé'],'Supprimer')
  else:q.row(['Votre panier est vide','Retour au catalogue'])
  q.heading('Total : selon panier');q.button('Livraison et règlement',secondary=True);q.y+=60;q.button('Créer une liste cadeaux',outline=True);q.y+=60;q.button('Vider le panier',outline=True);q.y+=60
 elif i==11:q.heading('Créer une liste cadeaux');q.form([('Nom de la liste',''),('Description',''),('Courriel de votre ami','')],'Créer la liste')
 elif i==12:q.heading('Listes de cadeaux');q.form([('Code personnel','ex. LC-TEST1234')],'Consulter la liste','Créer une liste (client)')
 elif i==13:q.heading('Liste de cadeaux','Code personnel • Exemple de présentation');q.row(['Dune','Quantité : 1 • Disponible'],'Ajouter');q.row(['Le Petit Prince','Quantité : 1 • Disponible'],'Ajouter');q.button('Retour',outline=True);q.y+=60
 elif i==14:q.heading('Livraison et règlement');q.form([('Total indicatif local','Selon panier'),('Mode de livraison','Standard'),('Mode de règlement','Paiement simulé (API)')],'Confirmer la commande simulée');q.wrap(p,q.y,'Aucune donnée bancaire collectée.',c,15);q.y+=35;q.button('Voir paiement externe',outline=True);q.y+=60
 elif i==15:q.heading('Paiement externe (maquette)');q.wrap(p,q.y,'Aucun paiement réel. Aucun champ carte n’est envoyé à l’API.',c);q.y+=65;q.button('Retour au règlement simulé');q.y+=65
 elif i==16:q.heading('Confirmation d’achat');q.row(['Votre commande simulée a été enregistrée','N° • Statut • Total serveur']);q.button('Mes commandes');q.y+=60;q.button('Accueil',outline=True);q.y+=60
 elif i==17:q.heading('Mes commandes');q.row(['N° • Date • Total • Statut','Données selon API'])
 elif i>=18:
  q.rect(p,q.y,c,44,q.p);q.text(p+12,q.y+28,'Admin  |  Ouvrages  |  Commandes  |  Utilisateurs',12 if m else 17,'white',True);q.y+=60;q.heading(titles[i-1])
  if i==18:q.row(['Ouvrages en stock','Valeur API']);q.row(['Commandes visibles','Valeur API']);q.button('Gérer les ouvrages');q.y+=60;q.button('Voir les commandes',outline=True);q.y+=60
  if i==19:q.button('Ajouter',secondary=True);q.y+=60;q.text(p,q.y+15,'ID • Titre • Prix • Stock • Actions',14,q.p,True);q.y+=30;[q.row([b,'Prix • Stock selon API','Supprimer'],'Modifier') for b in books]
  if i==20:q.form([(f,'') for f in ['Titre','Auteur','ISBN','Prix','Stock','URL de l’image','Date de publication','Catégorie','Description']],'Enregistrer','Annuler')
  if i==21:q.row(['ID • Client • Total','Date • Statut : sélectionner']);q.row(['Commande suivante','Données selon API'])
 return q.finish()

mapping={'Accueil_Client':1,'Fiche_ouvrage_Client':5,'Panier_Client':10,'Checkout_Client':14,'Confirmation_Client':16,'Connexion_Client':6,'Code_Ami':12,'Liste_Ami':13,'Dashboard_Admin':18,'Liste_ouvrages_Admin':19,'Formulaire_ouvrage_Admin':20,'Commandes_Admin':21}
for f in XD.glob('0[123]_*/*.svg'):
 for name,i in mapping.items():
  if f.stem.endswith(name):f.write_text(screen(i,390 if 'Mobile' in f.name else 1440));break
for f in WF.glob('0[12]_*/*.svg'):
 i=int(f.name.split('_')[1]);f.write_text(screen(i,390 if 'Mobile' in f.name else 1440,True))
for filename,i,state in [('HF_Desktop_07_Fiche_quantite2',5,'quantity'),('HF_Desktop_08_Panier_quantite2',10,'quantity'),('HF_Desktop_09_Panier_vide',10,'empty'),('HF_Desktop_10_Paiement_externe',15,''),('HF_Desktop_11_Mes_commandes',17,'')]:
 (XD/'01_Client'/f'{filename}.svg').write_text(screen(i,1440,state=state))
(XD/'03_Administrateur/HF_Desktop_05_Connexion_Admin.svg').write_text(screen(6,1440))
print('SVG créés',len(list(XD.glob('0[123]_*/*.svg'))),len(list(WF.glob('0[12]_*/*.svg'))))
