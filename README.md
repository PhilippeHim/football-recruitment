# Terrain — Tableau de bord de recrutement

Application pédagogique pour préparer une présélection de joueurs à partir des notes EA Sports FC. Développée avec React, Vite, Recharts et PapaParse ; les données sont chargées depuis un CSV et les calculs s’effectuent dans le navigateur.

**Parcours :** Accueil → Ligues et clubs → Profils métier → Rechercher → Analyser la sélection → Comparer les joueurs → Mon mercato. Huit profils métier proposent des seuils ajustables ; la recherche permet de filtrer les joueurs et de trier les résultats. Le comparateur accueille jusqu’à trois joueurs de champ, avec un radar et les notes détaillées.

**Analyse et mercato :** histogramme des notes globales (OVR), comparaison des ligues et nuage vitesse–dribble (PAC–DRI), avec options de médianes et de régression. Mon mercato permet de composer un onze, de suivre un budget et des objectifs de niveau et de jeunesse, puis de simuler une revalorisation. Le projet mercato est enregistré dans le stockage local du navigateur.

**Installation et lancement :** Node.js ≥ 22.12.0 et npm sont nécessaires. Ouvrir un terminal dans le dossier `recrutement` contenant `package.json`, exécuter `npm ci` à la première installation, puis `npm run dev`. Ouvrir l’adresse affichée par Vite : généralement `http://127.0.0.1:5173/`, ou un autre port si celui-ci est occupé. Arrêter le serveur avec `Ctrl+C`.

**Si le terminal affiche `npm: command not found` :** sur le Mac configuré pour ce projet, exécuter `export PATH="$HOME/.local/share/node-v22.23.2-darwin-arm64/bin:$PATH"`, puis `npm run dev`. Ce chemin est enregistré dans `~/.zshrc` et `~/.zprofile` ; ouvrir un nouveau terminal pour le charger. Vérifier l’accès avec `node --version` et `npm --version`. Sur une autre machine, utiliser le chemin de sa propre installation Node.js.

**Données et limites :** `public/all_players_with_market_value.csv` ; conserver les colonnes attendues lors de son remplacement. Les notes de jeu et les valeurs marchandes ne représentent ni des performances récentes ni des prix de transfert garantis. Les effectifs peuvent être incomplets et les valeurs marchandes absentes ; les simulations de progression sont des hypothèses pédagogiques.

**Commandes et organisation :** `npm test` (tests unitaires), `npm run test:ui` (tests Playwright avec Google Chrome installé), `npm run build` (production dans `dist/`), `npm run preview` (aperçu après compilation), `npm run format` et `npm run format:check` (Prettier). Le code est réparti entre `src/app`, `src/constante`, `src/components`, `src/hooks`, `src/services`, `src/utils` et `src/styles` ; voir le [guide d’architecture](docs/ARCHITECTURE.md). Le `.gitignore` exclut notamment les dépendances, builds, rapports de tests, fichiers d’environnement locaux et journaux.
