# StreamPlanner

Application web permettant aux streamers de créer, gérer et exporter leur planning de stream.

---

## 🚀 Fonctionnalités

### Utilisateurs

* Création de compte
* Connexion
* Création et gestion de plannings
* Consultation de la landing page
* Modification du profil (email, mot de passe, chaîne Twitch, logo)
* Ajout, modification et suppression d’événements
* Export du planning en **image PNG**
* Duplication d’un planning

---

## 🛠️ Stack technique

### Front-end

* Angular
* TypeScript
* HTML / SCSS

### Back-end

* Node.js
* Express
* API REST
* Authentification JWT

### Base de données

* PostgreSQL

---

## 📄 Structure du projet

```
/frontend  → Application Angular
/backend   → API Node.js / Express
```

---

## 📦 Installation

### Prérequis

- **Node.js** (v18+)
- **npm** ou **yarn**
- **PostgreSQL** (v12+)
- Git

### Backend

1. **Accéder au dossier backend**
   ```bash
   cd backend
   ```

2. **Installer les dépendances**
   ```bash
   npm install
   ```

3. **Configurer les variables d'environnement**
   ```bash
   # Créer un fichier .env à la racine de /backend
   cp .env.example .env
   ```
   
   Configurer les variables :
   ```env
   DB_HOST=localhost
   DB_PORT=5432
   DB_NAME=streamflow
   DB_USER=postgres
   DB_PASSWORD=your_password
   JWT_SECRET=your_secret_key
   NODE_ENV=development
   ```

4. **Initialiser la base de données**
   ```bash
   npm run db:init
   ```

5. **Démarrer le serveur**
   ```bash
   npm start
   ```
   Le serveur s'exécutera sur `http://localhost:3000`

### Frontend

1. **Accéder au dossier frontend**
   ```bash
   cd frontend
   ```

2. **Installer les dépendances**
   ```bash
   npm install
   ```

3. **Configurer les variables d'environnement**
   ```bash
   # Créer un fichier .env dans /frontend
   echo "API_URL=http://localhost:3000/api" > .env
   ```

4. **Démarrer l'application Angular**
   ```bash
   ng serve
   ```
   Accéder à `http://localhost:4200`

---

## 🚀 Utilisation

1. **Créer un compte** : Inscription sur la page `/register`
2. **Se connecter** : Connexion avec email/password
3. **Créer un planning** : Dashboard → Nouveau planning
4. **Ajouter des streams** : Sélectionner une semaine et ajouter des événements

---

## 📄 Phase du projet

* En cours - Fonctionnalités de base implémentées
* ✅ Authentification (Login/Register)
* ✅ Gestion des plannings
* ✅ Ajout/Suppression de streams
* ⏳ Export en image PNG
* ⏳ Modification de profil

