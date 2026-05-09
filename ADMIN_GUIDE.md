# 📊 Guide d'Administration - TechNova RDC

## Accès à l'Espace Administrateur

### URL de Connexion
```
http://votresite.com/admin-login.html
```

### Identifiants par défaut
- **Mot de passe**: `admin2025`
- ⚠️ **À CHANGER immédiatement** dans les paramètres après la première connexion

### Bouton d'Accès Rapide
Un bouton **⚙️** (engrenage) est disponible en bas à droite de la page d'accueil pour accéder facilement à l'admin.

---

## 🎯 Fonctionnalités Principales

### 1️⃣ Tableau de Bord
- **Statistiques en temps réel**:
  - Nombre total de produits
  - Nombre de commandes
  - Nombre d'utilisateurs
  - Revenus totaux
  
- **Aperçu des derniers produits**
- **Vue rapide des métriques clés**

### 2️⃣ Gestion des Produits
#### Ajouter un Produit
1. Cliquez sur l'onglet "Produits"
2. Cliquez sur "Ajouter"
3. Remplissez les informations :
   - Nom du produit
   - Catégorie (Électronique, Homme, Femme, Autres)
   - Description détaillée
   - Prix original
   - Prix réduit (avec remise)
   - Image (nom du fichier)
4. Cliquez sur "Ajouter le produit"

#### Modifier un Produit
1. Dans l'onglet "Produits", cliquez sur "Modifier"
2. Mettez à jour les informations souhaitées
3. Cliquez sur "Sauvegarder"

#### Supprimer un Produit
1. Cliquez sur "Supprimer" dans le tableau
2. Confirmez la suppression

### 3️⃣ Gestion des Commandes
- **Visualisez toutes les commandes** avec :
  - Numéro de commande
  - Nom du client
  - Nombre d'articles
  - Total
  - Date
  - Statut (En attente, Traitée, Annulée)

- **Mettez à jour le statut** :
  - Changez le statut directement depuis la liste
  - Les changements sont sauvegardés automatiquement

### 4️⃣ Gestion des Utilisateurs
- **Liste de tous les utilisateurs enregistrés** avec :
  - Email
  - Nom d'utilisateur
  - Date d'inscription

- **Supprimez un utilisateur** si nécessaire

### 5️⃣ Gestion des Contacts
- **Messages de contact** reçus via WhatsApp
- État du message (lu/non lu)
- Actions rapides

### 6️⃣ Paramètres
#### Configuration du Site
- **Numéro WhatsApp** : Changez le numéro pour les commandes
- **Email de support** : Email affiché aux clients
- **Mot de passe administrateur** : Changez régulièrement

#### Actions Utiles
- **Exporter les données** : Téléchargez un fichier CSV avec :
  - Tous les produits
  - Toutes les commandes
  - Tous les utilisateurs
  
- **Vider le cache** : Réinitialise les favoris et paniers des clients

---

## 🔒 Sécurité

### Recommandations
1. ✅ **Changez le mot de passe par défaut immédiatement**
2. ✅ **Utilisez un mot de passe fort** (min 8 caractères, majuscules, chiffres)
3. ✅ **Cochez "Rester connecté"** uniquement sur un ordinateur personnel
4. ✅ **Déconnectez-vous** après chaque session
5. ✅ **Gardez votre mot de passe secret**

### Conservation des Données
- Toutes les données sont stockées **localement** dans le navigateur
- Les données persévèrent même si vous fermez le navigateur
- Les données sont **supprimées si vous effacez les données du site** dans les paramètres du navigateur

---

## 📱 Intégration WhatsApp

### Configuration
1. Allez dans **Paramètres**
2. Entrez votre **numéro WhatsApp** (sans le +)
3. Cliquez sur **Enregistrer**

### Fonctionnement
- Les clients envoient leurs commandes via WhatsApp
- Les messages arrivent sur le numéro configuré
- Vous recevez les détails de la commande formatés

### Format de Message Reçu
```
*Commande TechNova RDC*

• *Client*: Jean Dupont
• *Adresse*: Av. Du gouverneur N°16, Bipemba, Mbujimayi

• *Produit(s) commandé(s)*:
- Gourde isotherme ×1: 13$
- Basket blanche ×2: 40$

• *Total*: 53.00$
```

---

## 📊 Export de Données

### Qu'est-ce qui est exporté ?
Le fichier CSV contient :
- **Produits** : ID, nom, catégorie, prix, image
- **Commandes** : ID, client, total, date, statut
- **Utilisateurs** : Email, nom d'utilisateur, date d'inscription

### Comment exporter ?
1. Allez dans **Paramètres**
2. Cliquez sur **Exporter les données**
3. Le fichier `technova-data.csv` sera téléchargé

### Utilisation du fichier CSV
- Ouvrez avec **Excel**, **Google Sheets**, ou **LibreOffice Calc**
- Idéal pour les analyses, rapports et sauvegardes

---

## 🎓 Conseils d'Utilisation

### Gestion des Produits
- 📸 Assurez-vous que le nom de l'image correspond à un fichier existant
- 💰 Le prix réduit doit être inférieur au prix original
- 📝 Utilisez des descriptions claires et détaillées
- 🏷️ Catégorisez bien vos produits pour une meilleure expérience client

### Gestion des Commandes
- ✅ Marquez les commandes comme "Traitées" une fois confirmées
- ❌ Marquez comme "Annulée" si le client ne peut pas être livré
- 🔔 Vérifiez régulièrement les nouvelles commandes

### Maintenance
- 🔄 Exportez vos données régulièrement (sauvegarde)
- 🧹 Supprimez les produits obsolètes
- 👥 Gérez les utilisateurs inactifs si nécessaire

---

## 🆘 Dépannage

### Problème: Je ne peux pas accéder à l'admin
**Solution**: 
- Vérifiez que vous utilisez le bon mot de passe
- Assurez-vous que les cookies sont activés dans votre navigateur
- Essayez une navigation privée/incognito

### Problème: Mes données ont disparu
**Solution**:
- Les données sont stockées dans le navigateur (localStorage)
- Ne videz pas les données du navigateur
- Utilisez le même navigateur/ordinateur
- Faites des exports réguliers pour la sauvegarde

### Problème: L'export ne fonctionne pas
**Solution**:
- Vérifiez que votre navigateur accepte les téléchargements
- Essayez un autre navigateur
- Vérifiez l'espace disque disponible

---

## 📞 Support

Pour toute question ou problème:
- 📧 **Email**: tech28059@gmail.com
- 💬 **WhatsApp**: [Votre numéro]
- 🌐 **Site**: technova-rdc.com

---

**Version**: 1.0  
**Mise à jour**: 2025  
**Statut**: Production
