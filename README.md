# Alliance & Patrimoine — version statique de démonstration

Site statique (HTML, CSS, JavaScript, sans dépendance ni étape de compilation) destiné à une publication sur **GitHub Pages**. Il présente le futur site de l'association : site public, espace adhérent et back-office, avec des contenus d'exemple.

## Accès de démonstration

Un seul identifiant ouvre l'espace adhérent **et** le back-office : il est transmis séparément au bureau (il n'est pas écrit dans ce dépôt, seule son empreinte SHA-256 l'est, dans `assets/js/app.js`).

> **Attention : ce n'est pas une sécurité.** La vérification se fait dans le navigateur ; toutes les pages, y compris celles de l'espace adhérent et du back-office, restent lisibles par quiconque connaît leur adresse ou lit le dépôt. **Ne publiez jamais de données réelles d'adhérents** (coordonnées, cotisations, documents internes) sur ce site. La vraie sécurité (connexion par lien e-mail, double authentification, rôles) arrive avec la version Laravel.

Pour changer l'identifiant : calculer `sha256("identifiant:motdepasse")` (identifiant en minuscules), par exemple avec `node -e "console.log(require('crypto').createHash('sha256').update('identifiant:motdepasse').digest('hex'))"`, et remplacer la valeur de `CREDENTIAL_HASH` dans `assets/js/app.js`.

## Publier sur GitHub Pages

1. Créer un dépôt sur GitHub (il peut être privé avec un compte payant ; avec un compte gratuit, le dépôt doit être public).
2. Dans ce dossier :
   ```
   git remote add origin https://github.com/<compte>/<depot>.git
   git push -u origin main
   ```
3. Sur GitHub : **Settings → Pages → Build and deployment → Source : Deploy from a branch**, branche `main`, dossier `/ (root)`, puis **Save**.
4. Le site est en ligne après une à deux minutes à l'adresse `https://<compte>.github.io/<depot>/`.

Tous les liens sont relatifs : le site fonctionne dans un sous-dossier comme sur un domaine personnalisé. Le fichier `.nojekyll` désactive le traitement Jekyll, `robots.txt` et la balise `noindex` évitent l'indexation par les moteurs de recherche.

## Tester en local

Ouvrir `index.html` dans un navigateur suffit pour le site public. Pour la connexion (l'API de chiffrement du navigateur exige une origine sécurisée), lancer un petit serveur : `python -m http.server 8000` puis ouvrir http://localhost:8000.

## Contenu

| Partie | Pages |
|---|---|
| Site public | accueil, annuaire filtrable et 8 fiches conseiller, 8 domaines, agenda et 4 événements, l'association (adhésion, contact), mentions légales, plan du site, 404 |
| Espace adhérent | accueil, ma fiche, paiements, documents |
| Back-office | tableau de bord, adhérents et cotisations, publications, réglages |

Les textes entre crochets sont à remplacer par le contenu réel. Police : Plus Jakarta Sans, auto-hébergée (licence SIL OFL, `assets/fonts/LICENSE-OFL.txt`).
