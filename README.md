# Groupomania

## Présentation

### Le Projet
Réseau social interne de l'entreprise Groupomania.

### Fonctionnalités
- **Compte utilisateur** : création de compte, connexion, suppression de compte, édition du profil et modification du mot de passe.
- **Posts** : création de posts avec texte et/ou image, modification et suppression de posts.
- **Commentaires** : ajout, modification et suppression.
- **Like** : possibilité de liker un post
- **Admin** : un utilisateur doté du droit d'administrateur a la possibilité de supprimer les posts et les commentaires d'autres utilisateurs.

## Back-end

### Technologies
- Node.js
- Express.js
- Sequelize
- Base de données : MySQL (cf partie Base de données, ci-dessous)

### Instructions
**Installation**

```sh
cd backend
npm install
```

**Variables d'environnement**

S'inspirer des valeurs par défaut du fichier .env.example pour créer et remplir le fichier .env.

La clé de chiffrement CryptoJS doit être composée d'exactement 16 ou 32 caractères.

**Base de données**

Se connecter à un serveur MySQL (MySQL doit être installé sur l'ordinateur) et créer la base de données.

Dans le dossier backend/config, s'inspirer des valeurs par défaut du fichier `config.json.example` pour créer et remplir le fichier `config.json` qui permet de se connecter à la base de données.

Créer les tables de la BD avec la commande `npx sequelize-cli db:migrate`.

**Serveur de développement**

Lancer le serveur de développement avec `npm run dev` (ou `nodemon server`) ou `npm run start` (ou `node server`).

Le serveur utilise l'adresse `http://localhost:3000`.

## Front-end

### Technologies
- HTML
- CSS
- JavaScript
- Vue 3
- Bootstrap 5

### Instructions
**Installation**
```sh
cd frontend
npm install
```
**Serveur de développement**

Lancer le serveur de développement avec `npm run serve`.

L'application est accessible à l'adresse `http://localhost:8080`.

## Utilisation
**Création compte utilisateur**

Pour créer un compte :
- **Pseudo** : doit commencer par une lettre et contenir entre 3 et 30 caractères alphanumériques
- **Email** : email valide
- **Mot de passe** : doit contenir 8 caractères au minimum, contenir des lettres (au moins une majuscule, au moins une minuscule), au moins 2 chiffres ainsi qu'au moins un caractère spécial.

**Admin**

Pour donner le droit d'admin à un utilisateur : dans la table Users, mettre à jour la colonne isAdmin avec la valeur 1 pour l'utilisateur choisi.