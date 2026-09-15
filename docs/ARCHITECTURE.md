# Lire et modifier Terrain

L’application est organisée par responsabilité. `src/app` assemble la page ; les composants affichent les données ; les hooks gèrent les états React ; les services chargent le fichier ; les utilitaires effectuent les calculs.

## Arborescence

```text
recrutement/
├── public/all_players_clean.csv      # Données servies au navigateur
├── src/
│   ├── main.jsx                     # Montage React et import des styles
│   ├── app/
│   │   ├── App.jsx                  # Entrée de l’interface
│   │   ├── RecruitmentPage.jsx      # Cadre commun, navigation et états partagés
│   │   ├── SearchPage.jsx           # Recherche et tableau
│   │   ├── AnalysisPage.jsx         # Indicateurs et graphiques
│   │   └── ComparisonPage.jsx       # Radar, notes et écarts
│   ├── constante/
│   │   ├── players.js               # Colonnes CSV, notes et postes
│   │   ├── leagues.js               # Cinq grands championnats masculins
│   │   ├── filters.js               # Filtres initiaux, réinitialisation, préréglage
│   │   ├── charts.js                # Couleurs, axes et taille des intervalles
│   │   └── table.js                 # Colonnes, tri initial et taille des pages
│   ├── components/
│   │   ├── layout/                  # En-tête, introduction, pied de page
│   │   ├── filters/                 # Barre latérale et contrôles de recherche
│   │   ├── metrics/                 # Indicateurs et carte d’un indicateur
│   │   ├── charts/                  # Un graphique par fichier, infobulle séparée
│   │   ├── table/                   # Tableau, en-tête, corps, cellule et pagination
│   │   └── feedback/                # Chargement, erreur et sélection vide
│   ├── hooks/
│   │   ├── usePlayers.js            # Chargement et annulation de la requête
│   │   ├── useRecruitment.js        # Filtres et sélection commune à toutes les vues
│   │   └── usePlayerTable.js        # Tri puis pagination
│   ├── services/
│   │   ├── loadPlayers.js           # Lecture HTTP du fichier local
│   │   └── parsePlayers.js          # PapaParse, nettoyage, conversion et validation
│   ├── utils/                      # Une fonction de calcul par fichier
│   └── styles/                     # CSS séparé par zone, responsive en dernier
├── tests/                          # Tests des données et des calculs
├── e2e/                            # Test de l’interface dans Chrome
└── docs/ARCHITECTURE.md             # Ce guide
```

`app` est inclus dans `src` : il s’agit de code source React, pas d’une seconde application. Le dossier `constante` suit le nom demandé et ne contient pas de logique React.

## Parcours de lecture conseillé

1. Lire `src/app/RecruitmentPage.jsx` pour voir la composition de l’écran.
2. Lire `src/hooks/useRecruitment.js` pour comprendre les actions de filtrage.
3. Lire `src/utils/filterPlayers.js` pour voir les critères appliqués à chaque joueur.
4. Lire `SearchPage.jsx`, `AnalysisPage.jsx` et `ComparisonPage.jsx` pour voir le contenu de chaque étape.
5. Ouvrir le composant du graphique ou du filtre à modifier.

## Circulation des données

```text
CSV → loadPlayers → parsePlayers → usePlayers → lignes validées
                                                ↓
Contrôles → useRecruitment → filterPlayers → selectedPlayers
                                                ↓
                            indicateurs + graphiques + tableau
```

Les vues ne rechargent pas le CSV et ne refiltrent pas les joueurs. Elles reçoivent le même tableau `selectedPlayers`. Les options de ligue proviennent du dataset complet pour rester disponibles après un filtrage.

Le tableau trie une copie de cette sélection avant de la paginer. Une modification des filtres réinitialise la recherche locale, la pagination et le tri dans `usePlayerTable`. Un changement de page de navigation conserve ces trois états.

## Où intervenir ?

| Besoin                               | Fichier ou dossier                                                        |
| ------------------------------------ | ------------------------------------------------------------------------- |
| Modifier le profil « Ailier rapide » | `src/constante/filters.js` et son libellé dans `app/RoleProfilesPage.jsx` |
| Modifier les championnats exclus     | `src/constante/leagues.js`                                                |
| Ajouter un critère numérique         | `constante/filters.js`, `utils/filterPlayers.js` et les tests             |
| Ajouter une colonne au tableau       | `src/constante/table.js` ; rendu particulier dans `PlayerTableCell.jsx`   |
| Modifier un graphique                | Son fichier dans `src/components/charts/`                                 |
| Modifier la mise en page mobile      | `src/styles/responsive.css`                                               |
| Remplacer les données                | `public/all_players_clean.csv` en conservant les colonnes requises        |

## Navigation entre les pages

Le bandeau `JourneyNavigation.jsx` propose cinq liens : `#/accueil`, `#/profils`, `#/recherche`, `#/analyse` et `#/comparaison`. L’accueil est la destination par défaut et celle du logo. `usePageNavigation.js` lit l’URL, gère les liens directs et les boutons précédent/suivant du navigateur, actualise le titre du document et replace le focus au début du contenu. Ce routage par fragment fonctionne avec le serveur Vite et un hébergement statique.

Le cadre `RecruitmentPage` reste monté. Le CSV est donc chargé une fois ; les filtres, les profils comparés et l’état du tableau survivent aux changements de page. Seule la page active est rendue. Les options locales des graphiques (médianes, régression) reviennent à leur état initial quand on quitte l’analyse. Un rechargement complet réinitialise les données de session et conserve l’adresse de la page.

La comparaison n’affiche pas de barre latérale de filtres : elle offre une vue dédiée, avec des liens pour retourner choisir des joueurs. Un état explicatif est proposé lorsque la liste est vide.

## Page d’accueil et objectif

`HomePage.jsx` assemble `HomeHero`, `HomeJourney` et `HomePurpose`. L’objectif affiché est de préparer une présélection argumentée à partir d’un besoin de recrutement, dans un cadre pédagogique reposant sur les notes EA Sports FC. La page distingue mission, utilisateurs, résultat attendu et limites des données.

L’exemple de défenseur relanceur réutilise la définition de `roleProfiles.js` et calcule son effectif réel. Son bouton applique le même profil que le catalogue. Le contenu de présentation reste disponible si le CSV ne charge pas ; l’exemple est alors désactivé. Les liens vers les outils et le retour à l’accueil conservent les filtres et la comparaison pendant la session.

## Profils métier

`constante/roleProfiles.js` définit huit missions de joueurs de champ, les postes associés, trois seuils par rôle et leurs libellés. `createRoleFilters` prépare une recherche neuve avec OVR ≥ 75 ; ces valeurs sont des hypothèses pédagogiques, pas des standards sportifs. `RoleProfilesPage` affiche les résultats disponibles sur le dataset complet avant application, avec un filtre par famille.

Les seuils détaillés vivent dans `filters.minimums`. `filterPlayers` exige que toutes les notes correspondantes soient connues et supérieures ou égales aux minima. `parsePlayers` convertit les statistiques détaillées utilisées et conserve les champs absents comme valeurs inconnues ; aucune valeur n’est imputée.

`RoleCriteria` permet d’ajuster chaque seuil ; `ActiveRoleSummary` rappelle la mission et la sélection obtenue. Le tableau remplace ses notes générales PAC/DRI/SHO par les trois qualités du rôle et affiche le seuil sous chaque valeur. On peut trier ces colonnes. Retirer les critères métier garde le poste et les autres filtres ; appliquer un nouveau profil ou un raccourci de poste remet la recherche à ses valeurs prévues.

## Badge du profil appliqué

`ActiveProfileBadge.jsx` conserve le visuel vert de l’ancien raccourci et affiche uniquement un état, sans action au clic. `filters.presetId` identifie le profil appliqué ; le choix temporaire dans la liste des postes ne le modifie pas. `utils/activeProfile.js` compare tous les filtres au profil de référence pour afficher « Personnalisé », y compris après une modification de championnat, de catégorie ou de recherche textuelle.

Une réinitialisation affiche « Recherche libre ». Le scénario « Ailier rapide » reste accessible dans le catalogue des profils métier. Le badge indique les critères effectifs et reste conservé pendant la navigation.

## Recherche de profils

`PlayerSearch.jsx` modifie `filters.query`. `filterPlayers.js` applique tous les mots saisis au nom et au club, en plus des critères existants. `utils/searchText.js` normalise accents, casse et ponctuation ; les listes de postes et de championnats utilisent la même normalisation. Effacer la recherche conserve les autres filtres. Réinitialiser ou appliquer le préréglage efface aussi la recherche.

La recherche au-dessus du tableau est locale : `usePlayerTable.js` recherche dans tous les résultats avant le tri et la pagination, puis revient à la première page. Elle ne modifie ni les graphiques ni les joueurs conservés dans le comparateur. Une recherche vide de résultats garde son champ et masque la pagination.

## Comparaison de joueurs

`useComparison.js` conserve jusqu’à trois profils de joueurs de champ, indépendamment des filtres et de la pagination. `RecruitmentPage.jsx` porte cet état pour qu’un changement de page ne vide pas la comparaison. Les cartes signalent les profils hors des filtres actuels ; seul un retrait explicite les supprime.

`components/comparison/` sépare le panneau, le radar, les valeurs exactes et la barre de sélection. `constante/comparison.js` fixe les six axes et les couleurs ; `utils/comparePlayers.js` prépare les notes et les écarts pour les deux vues. Les gardiens ne sont pas sélectionnables : ces six statistiques de joueurs de champ ne permettent pas de comparer correctement leur profil spécifique.

Le radar apparaît à partir de deux profils. Le tableau exact reste accessible et met en gras le maximum de chaque qualité. L’écart présenté est descriptif et ne constitue pas un classement global des joueurs.

## Conventions de lecture

- Un composant React par fichier, nommé en `PascalCase`.
- Les hooks commencent par `use` ; ils concentrent les états et les actions.
- Les constantes sont en `MAJUSCULES` et les fichiers ont des imports explicites.
- Les noms du CSV (`OVR`, `League`, etc.) restent inchangés ; les noms de variables décrivent leur rôle.
- Les commentaires expliquent les règles métier et les choix moins évidents.
- Les fonctions de `utils` n’utilisent ni React, ni le réseau, ni le DOM.
- `styles/index.css` fixe l’ordre de cascade ; `responsive.css` est chargé en dernier.

## Vérification d’une modification

```sh
npm run format
npm run format:check
npm test
npm run build
npm run test:ui
```

Le test navigateur utilise Google Chrome installé sur la machine et démarre Vite si nécessaire. Il vérifie les trois graphiques, le préréglage, la sélection vide, la réinitialisation, le tri, la pagination et l’absence de débordement horizontal sur mobile. Les captures sont écrites dans `test-results/`.

Le README principal reste limité à 15 lignes pour respecter le cahier des charges pédagogique.
