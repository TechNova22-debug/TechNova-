function ImgA(){
    const searchInput = document.getElementById("search");
searchInput.value = "Air-Nike Homme";
searchInput.dispatchEvent(new Event('input')); // ou 'keyup' selon ton code
}
function ImgB(){
    const searchInput = document.getElementById("search");
searchInput.value = "Air-Pode";
searchInput.dispatchEvent(new Event('input')); // ou 'keyup' selon ton code
}
function ImgC(){
    const searchInput = document.getElementById("search");
searchInput.value = "Smart";
searchInput.dispatchEvent(new Event('input')); // ou 'keyup' selon ton code
}
//localStorage.removeItem('cart');
const produits = [
  { id: 1, nom: "Casque Bluetooth", description: "Son clair, autonomie 20h, design épuré.", image: "Casque.jpg", prix: 69, reduction: 49, quantite: 0, type : "populaire", categorie:"electronique"},
  { id: 2, nom: "Montre Connectée", description: "Cardio, sommeil, waterproof.", image: "Smart-watch.jpg", prix: 119, reduction: 89, quantite: 0, type : "populaire", categorie:"electronique"},
  { id: 3, nom: "Ordinateur Portable", description: "8Go RAM, SSD 256Go, écran 14\" HD.", image: "Pc.jpg", prix: 899, reduction: 629, quantite: 0, type : "populaire", categorie:"electronique" },
  { id: 4, nom: "Smartphone", description: "Triple capteur, écran AMOLED, 128Go.", image: "Smartphone.jpg", prix: 499, reduction: 369, quantite: 0, type : "populaire", categorie:"electronique" },
  { id: 5, nom: "Enceinte Bluetooth", description: "Waterproof, basses puissantes.", image: "Enceinte-bluetooth.jpg", prix: 79, reduction: 59, quantite: 0, type : "populaire", categorie:"electronique" },
  { id: 6, nom: "Clavier Mécanique", description: "Switchs silencieux, RGB, design gamer.", image: "Clavier-mecanique.jpg", prix: 149, reduction: 109, quantite: 0, type : "populaire", categorie:"electronique" },
  { id: 7, nom: "Air-Nike Homme", categorie: "homme", description: "Qualité Premium, ultra confortable.", image: "nike.png", prix: 75, reduction: 59, quantite: 0},
  {id: 8, nom: "Sac à Main Femme", categorie: "femme", description: "Cuir végan, pochette intérieure.", image: "Sac-dame.jpg", prix: 89, reduction: 65, quantite: 0},
  {id: 9, nom: "Lisseur Cheveux", categorie: "femme", description: "Céramique, chauffe rapide, compact.", image: "lisseur.jpg", prix: 55, reduction: 37, quantite: 0},
  {id: 10, nom: "Lampe LED", categorie: "autres", description: "Faible conso, design moderne.", image: "ampoule-led.jpg", prix: 39, reduction: 25, quantite: 0}
];


// On utilise toujours 'produits' comme panier de référence
let cart = JSON.parse(localStorage.getItem('cart')) || JSON.parse(JSON.stringify(produits));

function saveCart() {
    localStorage.setItem('cart', JSON.stringify(cart));
    }
function toggleCart() { 
    document.getElementById('cart-sidebar').classList.toggle('active');
displayCart();
}

function addToCart(productId) {
  let product = cart.find(item => item.id === productId);
  if (product) {
    product.quantite += 1;
    saveCart();
    displayCart();
  }
}

function increaseQuantity(productId) {
  let item = cart.find(product => product.id === productId);
  if (item) {
    item.quantite += 1;
    saveCart();
    displayCart();
  }
}

function decreaseQuantity(productId) {
  let item = cart.find(product => product.id === productId);
  if (item && item.quantite > 0) {
    item.quantite -= 1;
    saveCart();
    displayCart();
  }
}

function removeItem(productId) {
  let item = cart.find(product => product.id === productId);
  if (item) {
    item.quantite = 0;
    saveCart();
    displayCart();
  }
}

function displayCart() {
  let cartItems = document.getElementById('cart-items');
  let cartItems2 = document.getElementById('cart-items2');
  let cartCount = document.getElementById('cart-count');
  let cartCount1 = document.getElementById('cart-count1');
  let cartTotal = document.getElementById('cart-total');
  let cartTotal1 = document.getElementById('cart-total1');

  cartItems.innerHTML = '';
  cartItems2.innerHTML = '';
  let total = 0;
  let itemCount = 0;

  cart.forEach(item => {
    if (item.quantite > 0) {
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
      cartItems2.innerHTML += `
          <div class="summary-item">
            <span>${item.nom} ×${item.quantite}</span>
            <span>${item.reduction}$</span>
          </div>
      `;
    }
  });

  cartCount.innerText = itemCount;
  cartCount1.innerText = `(${itemCount})`;
  cartTotal.innerText = total.toFixed(2);
  cartTotal1.innerText = total.toFixed(2);
}

displayCart();

function getCurrentUsername() {
    let email = localStorage.getItem('currentUser') || sessionStorage.getItem('currentUser');
    if (email) {
        let userData = JSON.parse(localStorage.getItem(email));
        if (userData && userData.username) {
            return userData.username;
        }
    }
    return null;
}
//pour passer la commande bouton WhatsApp 
    function envoyerCommande() {
      // Nom par défaut
      let nom = getCurrentUsername();
      const adresse = document.getElementById('adresse').value.trim();
      const commune = document.getElementById('commune').value;

      if (!adresse || !commune) {
        alert("Veuillez remplir tous les champs.");
        return;
      }

      let message = ` *Commande TechNova RDC*\n\n`;
      message += `• *Client*: ${nom}\n`;
      message += `• *Adresse*: ${adresse}, ${commune}, Mbujimayi\n\n`;
      message += `• *produit(s) commandé(s)*:\n`;
      let total =0;
      cart.forEach(item => {
    if (item.quantite > 0) {
    total += item.reduction * item.quantite;
    message += `- ${item.nom} ×${item.quantite}: ${item.reduction}$\n`;
    }
    });
    message += `\n• *Total*: ${total.toFixed(2)}$\n\n`;
    message += `\n _La technologie au cœur du progrès_ `;

      const confirmation = confirm("Vous serez redirigé vers WhatsApp pour finaliser votre commande.");
      if (confirmation){
      const numero = "243840314159"; // Ton numéro
      const url = `https://wa.me/${numero}?text=${encodeURIComponent(message)}`;
      window.open(url, "_blank");
      localStorage.removeItem('cart');
      Accueil();
    }
}
    
// message ShowToast

function showToast(msg) {
  const toast = document.getElementById("toast");
  toast.textContent = msg;
  toast.classList.add("show");
  setTimeout(() => toast.classList.remove("show"), 2000);
}

const grid = document.getElementById("grid");
let favoris = JSON.parse(localStorage.getItem("favoris") || "[]");

produits
  .filter(p => p.type === "populaire")
  .forEach(p => {
  const card2 = document.createElement('div');
  card2.className = 'card2';
  const pourcentage = Math.round(((p.prix - p.reduction) / p.prix) * 100);
  const isFavori = favoris.includes(p.nom);

  card2.innerHTML = `
    <div class="product-img-section">
      <button class="favorite ${isFavori ? 'active' : ''}" title="Favori">
        <svg viewBox="0 0 28 28" fill="none">
          <path d="M14 24s-7.9-5.4-10.4-9.12C1.45 12.15 2.9 8.4 6.56 7.24c2.12-.67 4.38.09 5.77 1.93C13.53 6.6 16.69 5.52 19.1 6.7c3.51 1.59 4.39 5.73 2.36 8.18C21.02 17.13 14 24 14 24z" stroke="#b2b8c7" stroke-width="1.7" fill="#fff" />
        </svg>
      </button>
      <span class="discount">-${pourcentage}%</span>
      <img src="${p.image}" alt="${p.nom}">
    </div>
    <div class="product-title">${p.nom}</div>
    <div class="product-description">${p.description}</div>
    <div class="prices">
      <span class="old-price">${p.prix}$</span>
      <span class="new-price">${p.reduction}$</span>
    </div>
    <button class="add-btn2">Ajouter au panier</button>
  `;

  const favBtn = card2.querySelector(".favorite");
  favBtn.addEventListener("click", () => {
    favBtn.classList.toggle("active");
    if (favBtn.classList.contains("active")) {
      if (!favoris.includes(p.nom)) favoris.push(p.nom);
      showToast(`${p.nom} ajouté aux favoris ❤️`);
    } else {
      favoris = favoris.filter(nom => nom !== p.nom);
      showToast(`${p.nom} retiré des favoris 🤍`);
    }
    localStorage.setItem("favoris", JSON.stringify(favoris));
  });

  card2.querySelector(".add-btn2").addEventListener("click", () => {
addToCart(p.id); // fonction que tu as déjà
showToast(`${p.nom} ajouté au panier 🛒`);
});

  grid.appendChild(card2);
});
//La boutique 

    // Filtres
    let search = '';
    let selectedCat = 'tout';

    // Affichage produits (filtrés)
    function afficherProduits() {
      const grid = document.getElementById("grid1");
      grid.innerHTML = "";
      let filtres = produits.filter(p => 
        (selectedCat === "tout" || p.categorie === selectedCat) &&
        (p.nom.toLowerCase().includes(search) || p.description.toLowerCase().includes(search))
      );
      if (filtres.length === 0) {
        grid.innerHTML = `<div style="grid-column: 1/-1; text-align:center; color:#999; font-size:1.1em; padding:24px 0;">Aucun produit trouvé</div>`;
        return;
      }
      filtres.forEach(p => {
        const card2 = document.createElement('div');
        card2.className = 'card2';
        const pourcentage = Math.round(((p.prix - p.reduction) / p.prix) * 100);
        const isFavori = favoris.includes(p.nom);

        card2.innerHTML = `
          <div class="product-img-section">
            <button class="favorite ${isFavori ? 'active' : ''}" title="Favori">
              <svg viewBox="0 0 28 28" fill="none">
                <path d="M14 24s-7.9-5.4-10.4-9.12C1.45 12.15 2.9 8.4 6.56 7.24c2.12-.67 4.38.09 5.77 1.93C13.53 6.6 16.69 5.52 19.1 6.7c3.51 1.59 4.39 5.73 2.36 8.18C21.02 17.13 14 24 14 24z" stroke="#b2b8c7" stroke-width="1.7" fill="#fff" />
              </svg>
            </button>
            <span class="discount">-${pourcentage}%</span>
            <img src="${p.image}" alt="${p.nom}">
          </div>
          <div class="product-title">${p.nom}</div>
          <div class="product-description">${p.description}</div>
          <div class="prices">
            <span class="old-price">${p.prix}€</span>
            <span class="new-price">${p.reduction}€</span>
          </div>
          <button class="add-btn2">Ajouter au panier</button>
        `;

        const favBtn1 = card2.querySelector(".favorite");
        favBtn1.addEventListener("click", () => {
          favBtn1.classList.toggle("active");
          if (favBtn1.classList.contains("active")) {
            if (!favoris.includes(p.nom)) favoris.push(p.nom);
            showToast1(`${p.nom} ajouté aux favoris ❤️`);
          } else {
            favoris = favoris.filter(nom => nom !== p.nom);
            showToast1(`${p.nom} retiré des favoris 🤍`);
          }
          localStorage.setItem("favoris", JSON.stringify(favoris));
        });

        card2.querySelector(".add-btn2").addEventListener("click", () => {
          addToCart(p.id); // Fonction à ajouter plus tard
          showToast1(`${p.nom} ajouté au panier 🛒`);
        });

        grid.appendChild(card2);
      });
    }

    function showToast1(msg) {
      const toast = document.getElementById("toast1");
      toast.textContent = msg;
      toast.classList.add("show");
      setTimeout(() => toast.classList.remove("show"), 2000);
    }
    // Barre de recherche
    document.getElementById("search").addEventListener("input", function() {
      search = this.value.trim().toLowerCase();
      afficherProduits();
    });

    // Catégories
    document.querySelectorAll(".cat-btn").forEach(btn => {
      btn.addEventListener("click", function() {
        document.querySelectorAll(".cat-btn").forEach(b => b.classList.remove("active"));
        this.classList.add("active");
        selectedCat = this.dataset.cat;
        afficherProduits();
      });
    });

    afficherProduits();

    // --- WhatsApp Contact Zone ---
    document.getElementById("whatsappForm").addEventListener("submit", function(e) {
      e.preventDefault();
      const message = document.getElementById("message").value.trim();
      const photoInput = document.getElementById("photo");
      let url = `https://wa.me/243840314159?text=${encodeURIComponent(message)}`;
      // WhatsApp Web/mobile ne supporte pas l'envoi de fichiers par URL, mais propose d'ajouter une photo après ouverture
      if (photoInput.files.length > 0) {
        showToast("Vous pourrez ajouter la photo dans WhatsApp après ouverture.");
      }
      window.open(url, "_blank");
      this.reset();
    });    

// Dark mode support
if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
    document.documentElement.classList.add('dark');
}
window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', event => {
    if (event.matches) {
        document.documentElement.classList.add('dark');
    } else {
        document.documentElement.classList.remove('dark');
    }
});


// Pour se connecter

const loginBtn = document.getElementById('connexion');
const menuContainer = document.getElementById('loginPopup');
const formMessage = document.getElementById('form-message');

window.onload = function () {
    checkSession();
};

function toggleMenu1() {
    if (loginBtn.classList.contains('logged-in')) {
        logout();
    } else {
        showPopup();
    }
}
function passCommande() {
let total = 0;
cart.forEach(item => {
    if (item.quantite > 0) {
    total+= 1;
    }
    });
    if (total>0){
    if (loginBtn.classList.contains('logged-in')) {
    const confirmation = confirm("Finalisez votre commande ?");
        if (confirmation) {
            toggleCart();
            Commande();
        }        
    } else {
        const confirmation = confirm("veuillez d'abord vous connecter");
        if (confirmation) {
            toggleCart();
            showPopup();
        }
    }
    } else {
        alert("votre panier est vide!");
    }
}
function toggleMenu() {
    var menu = document.getElementById('mobileMenu');
    var overlay = document.getElementById('overlay');
    menu.classList.toggle('active');
    overlay.classList.toggle('active');
}
// Hachage basique (MD5 ou autre serait mieux, ici simulation simple pour local)
function hashPassword(password) {
    let hash = 0;
    for (let i = 0; i < password.length; i++) {
        hash = ((hash << 5) - hash) + password.charCodeAt(i);
        hash = hash & hash; // Convert to 32bit integer
    }
    return hash;
}

function validateEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function signUp() {
    let username = document.getElementById('signup-username').value.trim();
    let email = document.getElementById('signup-email').value.trim();
    let password = document.getElementById('signup-password').value;
    let formMessage = document.getElementById('form-message');

    if (username === "" || email === "" || password === "") {
        formMessage.innerText = "Veuillez remplir tous les champs.";
        return;
    }

    if (!validateEmail(email)) {
        lo = "Email invalide.";
        return;
    }

    if (password.length < 6) {
        formMessage.innerText = "Mot de passe trop court.";
        return;
    }

    if (localStorage.getItem(email)) {
        formMessage.innerText = "Adresse email existant.";
        return;
    }

    let hashedPassword = hashPassword(password);
    let userData = {
        username: username,
        password: hashedPassword
    };

    localStorage.setItem(email, JSON.stringify(userData));
    formMessage.innerText = "Inscription réussie. Veuillez vous connecter.";
    formMessage.className = "success";
    switchTab('login');

}

function login() {
    let email = document.getElementById('login-email').value.trim();
    let password = document.getElementById('login-password').value;
    let rememberMe = document.getElementById('rememberMe').checked;
    let formMessage = document.getElementById('form-message1');
    if (!localStorage.getItem(email)) {
        formMessage.innerText = "Email invalide.";
        return;
    }

    let userData = JSON.parse(localStorage.getItem(email));
    if (userData.password === hashPassword(password)) {
        formMessage.innerText = "Connexion réussie.";
        formMessage.className = "success";

        toggleMenu();

        if (rememberMe) {
            localStorage.setItem('currentUser', email);
        } else {
            sessionStorage.setItem('currentUser', email);
        }
        closePopup();
        updateUI(userData.username);
    } else {
        formMessage.innerText = "Mot de passe incorrect.";
        formMessage.className = "error";
    }

}

function checkSession() {
    let email = localStorage.getItem('currentUser') || sessionStorage.getItem('currentUser');
    if (email && localStorage.getItem(email)) {
        let userData = JSON.parse(localStorage.getItem(email));
        updateUI(userData.username);
    }
}

function updateUI(username) {
    loginBtn.innerText = "Déconnexion";
    loginBtn.classList.add('logged-in');
    menuContainer.classList.add('hidden');
            document.getElementById("Connex").style.backgroundColor = "red";
        document.getElementById("Connex").textContent = "Déconnexion";
}

function logout() {
    localStorage.removeItem('currentUser');
    sessionStorage.removeItem('currentUser');
    loginBtn.innerText = "Se connecter";
    loginBtn.classList.remove('logged-in');
    formMessage.innerText = "";
    document.getElementById("Connex").style.backgroundColor = "blue";
    document.getElementById("Connex").textContent = "Se connecter";
}

// informations 
    const cards = document.querySelectorAll('.card3');
    let index = 0;

    setInterval(() => {
      cards[index].classList.remove('visible3');
      index = (index + 1) % cards.length;
      cards[index].classList.add('visible3');
    }, 5000);

//Differentes pages

function Boutique(){
    document.getElementById("accueil-produit").style.display = "none";
    document.getElementById("Boutique").style.display = "block";
    document.getElementById("accueil-slider").style.display = "none";
        document.getElementById("about").style.display = "none";
        document.getElementById("Commande").style.display = "none";
}
function Commande(){
    document.getElementById("accueil-produit").style.display = "none";
    document.getElementById("Boutique").style.display = "none";
    document.getElementById("accueil-slider").style.display = "none";
        document.getElementById("about").style.display = "none";
        document.getElementById("Commande").style.display = "block";
}

function Accueil(){
    document.getElementById("accueil-produit").style.display = "block";
    document.getElementById("Boutique").style.display = "none";
    document.getElementById("accueil-slider").style.display = "block";
    document.getElementById("about").style.display = "none";
    document.getElementById("Commande").style.display = "none";
}
function About(){
    document.getElementById("accueil-produit").style.display = "none";
    document.getElementById("Boutique").style.display = "none";
    document.getElementById("accueil-slider").style.display = "none";
    document.getElementById("about").style.display = "block";
}
  const iframe4 = document.getElementById('about');

  iframe4.style.opacity = '1';
  iframe4.style.transition = 'opacity 0.5s ease';

    setTimeout(() => {
      iframe4.style.display = 'none';
  }, 3000);
