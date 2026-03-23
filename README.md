# 📝 Blog CleeRoute — Projet INF222

Ce projet est une application web complète (Full-Stack) permettant de gérer un blog personnel. Il a été conçu pour mettre en pratique les concepts de développement web, d'API REST et de gestion de bases de données relationnelles.

## 🚀 Fonctionnalités

- **Gestion des Articles (CRUD) :** Création, lecture, modification et suppression d'articles de blog.
- **Recherche Dynamique :** Filtrage des articles par mot-clé (titre ou contenu) en temps réel.
- **Interface Moderne :** Design responsive avec un dégradé violet/bleu professionnel, utilisant une architecture CSS moderne.
- **Documentation API :** Intégration de **Swagger** pour tester les points de terminaison (endpoints) de l'API.
- **Persistance des données :** Utilisation de SQLite pour conserver les articles même après l'arrêt du serveur.

## 🛠️ Stack Technique

- **Frontend :** HTML5, CSS3 (Flexbox/Grid), JavaScript (Fetch API).
- **Backend :** Node.js, Express.js.
- **Base de données :** SQLite via la bibliothèque `better-sqlite3`.
- **Documentation :** Swagger UI & Swagger JSDoc.
- **Communication :** CORS activé pour les échanges entre client et serveur.

## 📁 Structure du Projet

```text
mon-projet-blog/
├── server.js             # Serveur Express et configuration des routes API
├── database/
│   ├── db.js             # Initialisation de la base de données et des tables
│   └── blog.db           # Fichier de base de données SQLite
├── public/               # Fichiers statiques (Frontend)
│   ├── index.html        # Structure de la page
│   ├── style.css         # Styles et animations
│   └── script.js         # Logique frontend et appels API
├── package.json          # Dépendances et scripts Node.js
└── README.md             # Documentation du projet