// ============================================
// MODULE DE GESTION DU PANIER
// ============================================
class CartManager {
  constructor() {
    this.cart = JSON.parse(localStorage.getItem('cart')) || [];
    this.saveCart();
  }

  addItem(productId, quantity = 1) {
    let item = this.cart.find(p => p.id === productId);
    if (item) {
      item.quantite += quantity;
    }
    this.saveCart();
  }

  removeItem(productId) {
    this.cart = this.cart.map(p => p.id === productId ? { ...p, quantite: 0 } : p);
    this.saveCart();
  }

  updateQuantity(productId, quantity) {
    let item = this.cart.find(p => p.id === productId);
    if (item) item.quantite = Math.max(0, quantity);
    this.saveCart();
  }

  getTotal() {
    return this.cart.reduce((sum, p) => sum + (p.reduction * p.quantite), 0);
  }

  getCartItems() {
    return this.cart.filter(p => p.quantite > 0);
  }

  saveCart() {
    localStorage.setItem('cart', JSON.stringify(this.cart));
  }

  clear() {
    this.cart.forEach(p => p.quantite = 0);
    this.saveCart();
  }
}

// ============================================
// MODULE DE GESTION DES PRODUITS
// ============================================
class ProductManager {
  constructor() {
    this.products = this.initializeProducts();
    this.favorites = JSON.parse(localStorage.getItem('favoris') || '[]');
  }

  initializeProducts() {
    return [
      { id: 1, nom: "Gourde isotherme", description: "Conserve boisson chaude ou froide.", image: "Gourde1.jpg", prix: 18, reduction: 13, quantite: 0, type: "populaire", categorie: "autres" },
      { id: 2, nom: "Chaussure Campus", description: "Confort et style pour toutes vos sorties.", image: "Campus.jpg", prix: 25, reduction: 20, quantite: 0, type: "populaire", categorie: "homme" },
      { id: 3, nom: "Nike noir", description: "Style sobre, confort assuré.", image: "Nike-noir1.jpg", prix: 20, reduction: 16, quantite: 0, type: "populaire", categorie: "homme" },
      { id: 4, nom: "Baskets blanches", description: "Elegance et confort au quotidien.", image: "Basket-blanche.jpg", prix: 30, reduction: 20, quantite: 0, type: "populaire", categorie: "homme" },
      { id: 5, nom: "Chaussure Puma", description: "Sportif, confortables et durables.", image: "Puma.jpg", prix: 28, reduction: 20, quantite: 0, type: "populaire", categorie: "homme" },
      { id: 6, nom: "Sacs Gucci", description: "élégant pour un style raffiné au quotidien", image: "Sac-gucci.png", prix: 40, reduction: 25, quantite: 0, type: "populaire", categorie: "autres" },
      { id: 7, nom: "Sac noir", categorie: "homme", description: "Qualité Premium, ultra confortable.", image: "Sac-ecole.jpg", prix: 50, reduction: 35, quantite: 0 },
      { id: 8, nom: "Sac à Main Femme", categorie: "femme", description: "Cuir végan, pochette intérieure.", image: "Sac-dame.jpg", prix: 89, reduction: 65, quantite: 0 },
      { id: 9, nom: "Gourde NICE", categorie: "autre", description: "Parfaites pour vous hydrater partout.", image: "Gourdes.jpg", prix: 7, reduction: 4, quantite: 0 },
      { id: 10, nom: "Air-Pode", categorie: "electronique", description: "Faible conso, design moderne.", image: "airpod1.jpg", prix: 15, reduction: 10, quantite: 0 }
    ];
  }

  getPopular() {
    return this.products.filter(p => p.type === "populaire");
  }

  search(query, category = 'tout') {
    return this.products.filter(p => {
      const matchesCategory = category === 'tout' || p.categorie === category;
      const matchesQuery = p.nom.toLowerCase().includes(query.toLowerCase()) || 
                          p.description.toLowerCase().includes(query.toLowerCase());
      return matchesCategory && matchesQuery;
    });
  }

  toggleFavorite(productName) {
    const index = this.favorites.indexOf(productName);
    if (index > -1) {
      this.favorites.splice(index, 1);
    } else {
      this.favorites.push(productName);
    }
    localStorage.setItem('favoris', JSON.stringify(this.favorites));
  }

  isFavorite(productName) {
    return this.favorites.includes(productName);
  }

  getDiscount(product) {
    return Math.round(((product.prix - product.reduction) / product.prix) * 100);
  }
}

// ============================================
// MODULE D'AUTHENTIFICATION
// ============================================
class AuthManager {
  constructor() {
    this.currentUser = this.checkSession();
  }

  hashPassword(password) {
    let hash = 0;
    for (let i = 0; i < password.length; i++) {
      hash = ((hash << 5) - hash) + password.charCodeAt(i);
      hash = hash & hash;
    }
    return hash;
  }

  validateEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  register(username, email, password) {
    if (!username || !email || !password) {
      return { success: false, message: "Veuillez remplir tous les champs." };
    }
    if (!this.validateEmail(email)) {
      return { success: false, message: "Email invalide." };
    }
    if (password.length < 6) {
      return { success: false, message: "Mot de passe trop court (min 6 caractères)." };
    }
    if (localStorage.getItem(email)) {
      return { success: false, message: "Adresse email déjà existante." };
    }

    const userData = {
      username: username,
      password: this.hashPassword(password)
    };
    localStorage.setItem(email, JSON.stringify(userData));
    return { success: true, message: "Inscription réussie. Veuillez vous connecter." };
  }

  login(email, password, rememberMe = false) {
    if (!localStorage.getItem(email)) {
      return { success: false, message: "Email invalide." };
    }

    const userData = JSON.parse(localStorage.getItem(email));
    if (userData.password !== this.hashPassword(password)) {
      return { success: false, message: "Mot de passe incorrect." };
    }

    if (rememberMe) {
      localStorage.setItem('currentUser', email);
    } else {
      sessionStorage.setItem('currentUser', email);
    }

    this.currentUser = email;
    return { success: true, message: "Connexion réussie.", username: userData.username };
  }

  logout() {
    localStorage.removeItem('currentUser');
    sessionStorage.removeItem('currentUser');
    this.currentUser = null;
  }

  checkSession() {
    const email = localStorage.getItem('currentUser') || sessionStorage.getItem('currentUser');
    if (email && localStorage.getItem(email)) {
      return email;
    }
    return null;
  }

  getCurrentUsername() {
    if (!this.currentUser) return null;
    const userData = JSON.parse(localStorage.getItem(this.currentUser));
    return userData ? userData.username : null;
  }

  isLoggedIn() {
    return this.currentUser !== null;
  }
}

// ============================================
// MODULE DE NOTIFICATIONS
// ============================================
class ToastManager {
  static show(message, duration = 2000) {
    const toast = document.getElementById('toast') || this.createToast();
    toast.textContent = message;
    toast.classList.add('show');
    setTimeout(() => toast.classList.remove('show'), duration);
  }

  static createToast() {
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.id = 'toast';
    document.body.appendChild(toast);
    return toast;
  }
}

// ============================================
// INITIALISATION
// ============================================
let cart = new CartManager();
let products = new ProductManager();
let auth = new AuthManager();

// Initialiser la session au chargement
window.addEventListener('load', () => {
  if (auth.currentUser) {
    updateUILoggedIn(auth.getCurrentUsername());
  }
  displayCart();
});

// ============================================
// FONCTIONS COMPATIBILITÉ ANCIEN CODE
// ============================================

function addToCart(productId) {
  cart.addItem(productId);
  const product = products.products.find(p => p.id === productId);
  displayCart();
  showToast(`${product.nom} ajouté au panier 🛒`);
}

function removeItem(productId) {
  cart.removeItem(productId);
  displayCart();
}

function increaseQuantity(productId) {
  const item = cart.cart.find(p => p.id === productId);
  if (item) cart.updateQuantity(productId, item.quantite + 1);
  displayCart();
}

function decreaseQuantity(productId) {
  const item = cart.cart.find(p => p.id === productId);
  if (item && item.quantite > 0) cart.updateQuantity(productId, item.quantite - 1);
  displayCart();
}

function showToast(msg) {
  ToastManager.show(msg);
}

function displayCart() {
  const cartItems = document.getElementById('cart-items');
  const cartItems2 = document.getElementById('cart-items2');
  const cartCount = document.getElementById('cart-count');
  const cartCount1 = document.getElementById('cart-count1');
  const cartTotal = document.getElementById('cart-total');
  const cartTotal1 = document.getElementById('cart-total1');

  if (!cartItems) return;

  cartItems.innerHTML = '';
  if (cartItems2) cartItems2.innerHTML = '';

  let total = 0;
  let itemCount = 0;

  cart.getCartItems().forEach(item => {
    total += item.reduction * item.quantite;
    itemCount += item.quantite;

    cartItems.innerHTML += `
      <div class="cart-item">
        <div class="cart-item-header">
          <span>${item.nom}</span>
          <span>${item.reduction}$</span>
        </div>
        <div class="quantity-controls">
          <button onclick="decreaseQuantity(${item.id})">-</button>
          ${item.quantite}
          <button onclick="increaseQuantity(${item.id})">+</button>
          <button class="remove-btn" onclick="removeItem(${item.id})"><i class="fas fa-trash"></i></button>
        </div>
      </div>
    `;

    if (cartItems2) {
      cartItems2.innerHTML += `
        <div class="summary-item">
          <span>${item.nom} ×${item.quantite}</span>
          <span>${item.reduction}$</span>
        </div>
      `;
    }
  });

  if (cartCount) cartCount.innerText = itemCount;
  if (cartCount1) cartCount1.innerText = `(${itemCount})`;
  if (cartTotal) cartTotal.innerText = total.toFixed(2);
  if (cartTotal1) cartTotal1.innerText = total.toFixed(2);
}

function getCurrentUsername() {
  return auth.getCurrentUsername();
}

function login() {
  const email = document.getElementById('login-email').value.trim();
  const password = document.getElementById('login-password').value;
  const rememberMe = document.getElementById('rememberMe').checked;
  const formMessage = document.getElementById('form-message1');

  const result = auth.login(email, password, rememberMe);
  if (result.success) {
    formMessage.innerText = result.message;
    formMessage.className = "success";
    updateUILoggedIn(result.username);
    closePopup();
  } else {
    formMessage.innerText = result.message;
    formMessage.className = "error";
  }
}

function signUp() {
  const username = document.getElementById('signup-username').value.trim();
  const email = document.getElementById('signup-email').value.trim();
  const password = document.getElementById('signup-password').value;
  const formMessage = document.getElementById('form-message');

  const result = auth.register(username, email, password);
  formMessage.innerText = result.message;
  formMessage.className = result.success ? "success" : "error";

  if (result.success) {
    setTimeout(() => switchTab('login'), 1500);
  }
}

function updateUILoggedIn(username) {
  const loginBtn = document.getElementById('connexion');
  if (loginBtn) {
    loginBtn.innerText = "Déconnexion";
    loginBtn.classList.add('logged-in');
  }
  const connex = document.getElementById('Connex');
  if (connex) {
    connex.style.backgroundColor = "red";
    connex.textContent = "Déconnexion";
  }
}

function logout() {
  auth.logout();
  const loginBtn = document.getElementById('connexion');
  if (loginBtn) {
    loginBtn.innerText = "Se connecter";
    loginBtn.classList.remove('logged-in');
  }
  const connex = document.getElementById('Connex');
  if (connex) {
    connex.style.backgroundColor = "blue";
    connex.textContent = "Se connecter";
  }
}

function toggleMenu1() {
  const loginBtn = document.getElementById('connexion');
  if (loginBtn && loginBtn.classList.contains('logged-in')) {
    logout();
  } else {
    showPopup();
  }
}

function passCommande() {
  if (cart.getCartItems().length === 0) {
    alert("Votre panier est vide!");
    return;
  }

  if (!auth.isLoggedIn()) {
    const confirmation = confirm("Veuillez d'abord vous connecter");
    if (confirmation) {
      toggleCart();
      showPopup();
    }
    return;
  }

  const confirmation = confirm("Finalisez votre commande ?");
  if (confirmation) {
    toggleCart();
    Commande();
  }
}

function envoyerCommande() {
  const nom = getCurrentUsername();
  const adresse = document.getElementById('adresse')?.value.trim();
  const commune = document.getElementById('commune')?.value;

  if (!adresse || !commune) {
    alert("Veuillez remplir tous les champs.");
    return;
  }

  let message = `*Commande TechNova RDC*\n\n`;
  message += `• *Client*: ${nom}\n`;
  message += `• *Adresse*: ${adresse}, ${commune}, Mbujimayi\n\n`;
  message += `• *Produit(s) commandé(s)*:\n`;

  let total = 0;
  cart.getCartItems().forEach(item => {
    total += item.reduction * item.quantite;
    message += `- ${item.nom} ×${item.quantite}: ${item.reduction}$\n`;
  });

  message += `\n• *Total*: ${total.toFixed(2)}$\n\n`;
  message += `_La technologie au cœur du progrès_`;

  const confirmation = confirm("Vous serez redirigé vers WhatsApp pour finaliser votre commande.");
  if (confirmation) {
    const numero = "243840314159";
    const url = `https://wa.me/${numero}?text=${encodeURIComponent(message)}`;
    window.open(url, "_blank");
    cart.clear();
    displayCart();
    Accueil();
  }
}

// Exporte pour tests
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { CartManager, ProductManager, AuthManager, ToastManager };
}
