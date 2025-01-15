# OlympicGamesStarter

Ce projet est une application web basée sur Angular permettant de visualiser de manière interactive des données des Jeux Olympiques précédents. L'application est composée de deux pages principales : une page d'accueil (ou dashboard) et une page de détail, accessible en cliquant sur un pays.

Il a été généré avec [Angular CLI](https://github.com/angular/angular-cli) version 18.0.3.

Avant de commencer, n'oubliez pas d'installer les node_modules avec (`npm install`).

## Serveur de développement

Exécutez `ng serve` pour démarrer un serveur de développement. Rendez-vous sur `http://localhost:4200/`. L'application se rechargera automatiquement si vous apportez des modifications aux fichiers sources.

## Build

Exécutez `ng build` pour build le projet. Les fichiers générés seront stockés dans le dossier `dist/`.

## Pour comprendre

une architecture était déjà définie pour le projet sous cette forme :

- Dossier `pages` : contient les composants utilisés pour le routage
- Dossier `core` : contient la logique métier (dossiers `services` et `models`)

J'y ai ajouté :

- Dossier `components` : contient tous les composants réutilisables
- Page `Detail`qui avait été imaginée dans les maquettes mais pas encore créée dans le code
- Rempli les dossiers ->
  - `services` qui contient les services qui gèrent les appels API et la logique des données
  et 
  - `models` qui contient les interfaces TypeScript utilisées pour structurer les données

---

La récupération de données* se fait grâce à la bibliothèque RxJS qui était déjà installée dans l'achitecture du projet.
RxJS (Reactive Extensions for JavaScript) est une bibliothèque qui permet de gérer les flux asynchrones de manière réactive en utilisant des observables, facilitant ainsi la gestion des événements, des appels API et des manipulations de données dans des applications Angular.

*ici les données sont présentes en local dans le dossier `mock`sous un format JSON

## Pour conclure

Ce projet propose une approche structurée pour gérer les données des Jeux Olympiques précédents et les visualiser de manière interactive pour offrir une expérience utilisateur fluide.

### Dorian PERNOT ###