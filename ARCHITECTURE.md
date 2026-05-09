# 🏗️ Architecture - TechNova RDC v2.0

## 📁 Structure des Fichiers

```
TechNova-RDC/
│
├── 📄 index.html                 # Page principale (boutique)
├── 📄 about.html                 # Page à propos
├── 📄 admin.php                  # API admin (ancien)
│
├── 🎨 styles.css                 # Styles principaux
│
├── 🔧 script.js                  # Script ancien (obsolète)
├── 🔧 script-refactored.js      # Script nouveau (ACTIF) ⭐
│
├── 🛡️ admin-login.html          # Connexion administrateur ⭐
├── 🛡️ admin-dashboard.html      # Tableau de bord admin ⭐
├── 🛡️ admin-script.js           # Logique administration ⭐
│
├── 📖 ADMIN_GUIDE.md             # Guide complet administrateur
├── 📖 AMÉLIORATIONS.md           # Détails des améliorations
├── 📖 QUICKSTART.md              # Démarrage rapide
├── 📖 ARCHITECTURE.md            # Ce fichier
│
└── 📸 [Images] (jpg, png)        # Ressources images
```

---

## 🔄 Flux de Données

### Session Utilisateur
```
1. Utilisateur arrive sur index.html
2. JavaScript charge script-refactored.js
3. AuthManager vérifie la session (localStorage/sessionStorage)
4. Affichage du panier et statut de connexion
```

### Processus de Connexion (Client)
```
index.html
    ↓
Popup Connexion (JS)
    ↓
AuthManager.login()
    ↓
localStorage.setItem('currentUser', email)
    ↓
UI Updated (Déconnexion visible)
```

### Gestion du Panier
```
addToCart(productId)
    ↓
CartManager.addItem()
    ↓
localStorage.setItem('cart', JSON.stringify())
    ↓
displayCart() (UI Update)
```

### Processus Admin
```
admin-login.html
    ↓
Vérifier mot de passe
    ↓
localStorage.setItem('adminLogin', 'true')
    ↓
Redirection → admin-dashboard.html
    ↓
AdminDataManager charge les données
    ↓
Interface admin affichée
```

---

## 🏛️ Architecture MVC Simplifiée

### Model (Données)
```javascript
// Classes de gestion des données
- CartManager         (données panier)
- ProductManager      (données produits)
- AuthManager         (données authentification)
- AdminDataManager    (données administration)
```

### View (Interface)
```html
- index.html          (UI boutique)
- admin-login.html    (UI connexion admin)
- admin-dashboard.html (UI tableau de bord)
```

### Controller (Logique)
```javascript
- script-refactored.js (logique boutique)
- admin-script.js      (logique administration)
```

---

## 🔐 Système d'Authentification

### Architecture Authentification Client
```
Utilisateur
    ↓
Form Input (email, password)
    ↓
AuthManager.login()
    ↓
Email Check (localStorage)
    ↓
Password Hash & Compare
    ↓
Token Storage (localStorage/sessionStorage)
    ↓
Session Active
```

### Architecture Authentification Admin
```
Administrateur
    ↓
Entrée mot de passe
    ↓
Comparaison directe
    ↓
Token stockage (localStorage/sessionStorage)
    ↓
Redirection dashboard
```

### Sécurité
- ✅ Hash des mots de passe (fonction simple)
- ✅ Tokens sessio isolés
- ✅ Vérification d'authentification avant accès
- ⚠️ Pour production : utiliser JWT + backend

---

## 💾 Stockage des Données

### localStorage Structure
```json
{
  "currentUser": "email@example.com",
  "user_email@example.com": {
    "username": "Jean",
    "password": "hashedpassword"
  },
  "cart": [
    {
      "id": 1,
      "nom": "Produit",
      "quantite": 2,
      ...
    }
  ],
  "favoris": ["Produit 1", "Produit 2"],
  "admin_products": [...],
  "admin_orders": [...],
  "admin_whatsapp": "243840314159",
  "adminLogin": "true"
}
```

### Cycle de Vie des Données
```
Chargement (window.onload)
    ↓
localStorage.getItem()
    ↓
Traitement/Transformation
    ↓
Affichage dans l'UI
    ↓
Modification utilisateur
    ↓
Mise à jour données
    ↓
localStorage.setItem()
```

---

## 🎯 Classes ES6

### CartManager
```javascript
class CartManager {
  - addItem(productId, quantity)
  - removeItem(productId)
  - updateQuantity(productId, quantity)
  - getTotal()
  - getCartItems()
  - saveCart()
  - clear()
}
```

### ProductManager
```javascript
class ProductManager {
  - initializeProducts()
  - getPopular()
  - search(query, category)
  - toggleFavorite(productName)
  - isFavorite(productName)
  - getDiscount(product)
}
```

### AuthManager
```javascript
class AuthManager {
  - register(username, email, password)
  - login(email, password, rememberMe)
  - logout()
  - checkSession()
  - getCurrentUsername()
  - isLoggedIn()
}
```

### AdminDataManager
```javascript
class AdminDataManager {
  - loadProducts()
  - addProduct(product)
  - updateProduct(id, updates)
  - deleteProduct(id)
  - loadOrders()
  - addOrder(order)
  - updateOrderStatus(orderId, status)
  - loadUsers()
  - getStats()
}
```

---

## 🔌 Points d'Extension

### Ajouter une Nouvelle Classe
```javascript
// Créer une classe
class NewManager {
  constructor() {
    this.data = [];
  }
  
  // Méthodes
  method() {
    // Implémentation
  }
}

// Initialiser
let newManager = new NewManager();
```

### Intégrer avec Backend
```javascript
// À la place de localStorage
async function saveCart() {
  await fetch('/api/cart', {
    method: 'POST',
    body: JSON.stringify(cart)
  });
}
```

### Ajouter une Nouvelle Page Admin
```html
<!-- Dans admin-dashboard.html -->
<div id="nouvelle-section" class="tab-content">
  <!-- Contenu -->
</div>

<!-- Dans admin-script.js -->
case 'nouvelle-section':
  loadNewSection();
  break;
```

---

## 🚀 Performance

### Optimisations Actuelles
- ✅ Pas de requêtes réseau (localStorage)
- ✅ Code modulaire (chargement rapide)
- ✅ Animations fluides (CSS3)
- ✅ Responsive design (pas de reflow)

### Améliorations Futures
- 🔄 Lazy loading des images
- 🔄 Service Workers pour offline
- 🔄 Compression GZIP
- 🔄 Minification du code
- 🔄 CDN pour Font Awesome

---

## 🧪 Testabilité

### Structure Testable
```javascript
// Facile à tester
const cart = new CartManager();
cart.addItem(1, 2);
expect(cart.getCartItems().length).toBe(1);

// Facile à mocker
const products = new ProductManager();
const found = products.search('Gourde');
expect(found.length).toBeGreaterThan(0);
```

### Tests à Considérer
- ✅ Tests unitaires pour chaque classe
- ✅ Tests d'intégration pour flux
- ✅ Tests E2E pour UI/UX
- ✅ Tests de sécurité

---

## 🔄 Migration de l'Ancien Code

### Compatibilité Backward
```javascript
// Ancien code toujours fonctionnel
function Accueil() {
  // Fonctionne avec le nouveau code
}

// Nouveau code peut utiliser anciens appels
addToCart(productId); // Wrappé dans la nouvelle classe
```

### Path de Migration
```
Phase 1: Ajouter nouveau script-refactored.js (FAIT)
Phase 2: Garder ancien script.js (optionnel)
Phase 3: Remplacer complètement (futur)
```

---

## 📊 Diagramme d'Interaction

```
┌─────────────────────────────────────────────────┐
│             Client Boutique                      │
│  (index.html + script-refactored.js)           │
└────────────────┬────────────────────────────────┘
                 │
        ┌────────┴────────┐
        │                 │
    ┌───▼────┐       ┌────▼───┐
    │ Client  │       │ Produit │
    │ Auth    │       │Manager  │
    └─────────┘       └─────────┘
        │                 │
        └────────┬────────┘
                 │
          ┌──────▼──────┐
          │ Cart Manager│
          └──────┬──────┘
                 │
          ┌──────▼──────┐
          │ localStorage│
          └─────────────┘


┌─────────────────────────────────────────────────┐
│        Administration                            │
│(admin-login.html + admin-script.js)            │
└────────────────┬────────────────────────────────┘
                 │
        ┌────────┴────────┐
        │                 │
    ┌───▼────────┐   ┌────▼────────┐
    │Admin Auth  │   │AdminData    │
    │Manager     │   │Manager      │
    └────────────┘   └─────┬───────┘
                           │
                    ┌──────▼──────┐
                    │ localStorage│
                    └─────────────┘
```

---

## ⚙️ Configuration Requise

### Navigateur
- ES6 Support (2015+)
- localStorage API
- CSS Grid & Flexbox
- Fetch API (optionnel)

### Serveur
- HTTP/HTTPS
- Support static files
- ✅ Pas de backend requis (SPA)

### Dépendances Externes
- Font Awesome (CDN)
- Pas d'autres dépendances

---

## 🎓 Bonnes Pratiques Appliquées

✅ **DRY** (Don't Repeat Yourself) - Classes réutilisables  
✅ **SOLID** - Responsabilité unique par classe  
✅ **Modularité** - Code séparé en modules  
✅ **Nommage clair** - Variables/fonctions explicites  
✅ **Commentaires** - Explications où nécessaire  
✅ **Pas de dépendances** - Code autonome  
✅ **Responsive** - Mobile-first design  
✅ **Performance** - Optimisé pour la vitesse  

---

## 📈 Métriques

| Métrique | Valeur |
|----------|--------|
| Total de fichiers | 40+ |
| Fichiers JS | 5 |
| Fichiers HTML | 5 |
| Fichiers CSS | 1 |
| Fichiers documentation | 4 |
| Lignes de code (JS) | ~2000 |
| Lignes de code (HTML) | ~1000 |
| Lignes de documentation | ~500 |

---

## 🔮 Roadmap

### Court terme (1-3 mois)
- [ ] Tests unitaires
- [ ] Validation formulaires avancée
- [ ] Notifications email

### Moyen terme (3-6 mois)
- [ ] Backend Node.js/Express
- [ ] Base de données PostgreSQL
- [ ] API REST
- [ ] JWT Authentication

### Long terme (6+ mois)
- [ ] Application mobile native
- [ ] Système de paiement
- [ ] Analytics avancées
- [ ] Machine Learning recommendations

---

**Version**: 2.0  
**Architecture**: MVC Simplifiée  
**Tech Stack**: Vanilla JS, HTML, CSS  
**Maintenance**: Facile et documentée
