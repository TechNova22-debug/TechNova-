// ============================================
// GESTION AUTHENTIFICATION ADMIN
// ============================================

function checkAdminAuth() {
    if (!localStorage.getItem('adminLogin') && !sessionStorage.getItem('adminLogin')) {
        window.location.href = 'admin-login.html';
    }
}

function adminLogout() {
    if (confirm('Êtes-vous sûr de vouloir vous déconnecter ?')) {
        localStorage.removeItem('adminLogin');
        sessionStorage.removeItem('adminLogin');
        window.location.href = 'admin-login.html';
    }
}

// ============================================
// GESTION DES DONNÉES
// ============================================

class AdminDataManager {
    constructor() {
        this.loadProducts();
        this.loadOrders();
        this.loadUsers();
    }

    loadProducts() {
        const stored = localStorage.getItem('admin_products');
        this.products = stored ? JSON.parse(stored) : this.getDefaultProducts();
        this.saveProducts();
    }

    getDefaultProducts() {
        return [
            { id: 1, nom: "Gourde isotherme", description: "Conserve boisson chaude ou froide.", image: "Gourde1.jpg", prix: 18, reduction: 13, categorie: "autres" },
            { id: 2, nom: "Chaussure Campus", description: "Confort et style pour toutes vos sorties.", image: "Campus.jpg", prix: 25, reduction: 20, categorie: "homme" },
            { id: 3, nom: "Nike noir", description: "Style sobre, confort assuré.", image: "Nike-noir1.jpg", prix: 20, reduction: 16, categorie: "homme" },
            { id: 4, nom: "Baskets blanches", description: "Elegance et confort au quotidien.", image: "Basket-blanche.jpg", prix: 30, reduction: 20, categorie: "homme" },
            { id: 5, nom: "Chaussure Puma", description: "Sportif, confortables et durables.", image: "Puma.jpg", prix: 28, reduction: 20, categorie: "homme" },
            { id: 6, nom: "Sacs Gucci", description: "élégant pour un style raffiné au quotidien", image: "Sac-gucci.png", prix: 40, reduction: 25, categorie: "autres" },
            { id: 7, nom: "Sac noir", description: "Qualité Premium, ultra confortable.", image: "Sac-ecole.jpg", prix: 50, reduction: 35, categorie: "homme" },
            { id: 8, nom: "Sac à Main Femme", description: "Cuir végan, pochette intérieure.", image: "Sac-dame.jpg", prix: 89, reduction: 65, categorie: "femme" },
            { id: 9, nom: "Gourde NICE", description: "Parfaites pour vous hydrater partout.", image: "Gourdes.jpg", prix: 7, reduction: 4, categorie: "autres" },
            { id: 10, nom: "Air-Pode", description: "Faible conso, design moderne.", image: "airpod1.jpg", prix: 15, reduction: 10, categorie: "electronique" }
        ];
    }

    saveProducts() {
        localStorage.setItem('admin_products', JSON.stringify(this.products));
    }

    addProduct(product) {
        product.id = Math.max(...this.products.map(p => p.id), 0) + 1;
        this.products.push(product);
        this.saveProducts();
        return product;
    }

    updateProduct(id, updates) {
        const product = this.products.find(p => p.id === id);
        if (product) {
            Object.assign(product, updates);
            this.saveProducts();
            return true;
        }
        return false;
    }

    deleteProduct(id) {
        this.products = this.products.filter(p => p.id !== id);
        this.saveProducts();
    }

    loadOrders() {
        this.orders = JSON.parse(localStorage.getItem('admin_orders') || '[]');
    }

    addOrder(order) {
        order.id = Date.now();
        order.date = new Date().toLocaleString('fr-FR');
        order.status = 'en attente';
        this.orders.push(order);
        localStorage.setItem('admin_orders', JSON.stringify(this.orders));
    }

    updateOrderStatus(orderId, status) {
        const order = this.orders.find(o => o.id === orderId);
        if (order) {
            order.status = status;
            localStorage.setItem('admin_orders', JSON.stringify(this.orders));
        }
    }

    loadUsers() {
        // Collecter les utilisateurs depuis localStorage
        this.users = [];
        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            if (key.includes('@') && !key.startsWith('admin') && !key.startsWith('cart') && key !== 'currentUser' && key !== 'favoris') {
                try {
                    const userData = JSON.parse(localStorage.getItem(key));
                    if (userData.username) {
                        this.users.push({
                            email: key,
                            username: userData.username,
                            registered: new Date().toLocaleDateString('fr-FR')
                        });
                    }
                } catch (e) {
                    // Ignorer les données invalides
                }
            }
        }
    }

    getStats() {
        return {
            totalProducts: this.products.length,
            totalOrders: this.orders.length,
            totalUsers: this.users.length,
            totalRevenue: this.orders.reduce((sum, o) => sum + (o.total || 0), 0)
        };
    }
}

// ============================================
// INITIALIZATION
// ============================================

let dataManager;

window.addEventListener('load', () => {
    checkAdminAuth();
    dataManager = new AdminDataManager();
    initializeUI();
    loadDashboard();
});

function initializeUI() {
    const today = new Date().toLocaleDateString('fr-FR', { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
    });
    document.getElementById('currentDate').textContent = today;
}

// ============================================
// NAVIGATION
// ============================================

function switchTab(tabName) {
    // Hide all tabs
    document.querySelectorAll('.tab-content').forEach(tab => {
        tab.classList.remove('active');
    });
    
    // Remove active class from all menu links
    document.querySelectorAll('.sidebar-menu a').forEach(link => {
        link.classList.remove('active');
    });

    // Show selected tab
    const tab = document.getElementById(tabName);
    if (tab) {
        tab.classList.add('active');
    }

    // Add active to menu link
    event.target.classList.add('active');

    // Update title and load data
    const titles = {
        dashboard: 'Tableau de Bord',
        produits: 'Gestion des Produits',
        commandes: 'Gestion des Commandes',
        utilisateurs: 'Gestion des Utilisateurs',
        contacts: 'Messages de Contact',
        parametres: 'Paramètres'
    };
    document.getElementById('pageTitle').textContent = titles[tabName] || tabName;

    // Load tab content
    if (tabName === 'produits') loadProducts();
    if (tabName === 'commandes') loadOrders();
    if (tabName === 'utilisateurs') loadUsers();
    if (tabName === 'dashboard') loadDashboard();
}

function switchProductTab(tabName) {
    // Hide all product tabs
    document.getElementById('produitsList')?.classList.remove('active');
    document.getElementById('produitsAdd')?.classList.remove('active');
    
    // Remove active from buttons
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.remove('active');
    });

    // Show selected tab and button
    if (tabName === 'list') {
        document.getElementById('produitsList')?.classList.add('active');
    } else {
        document.getElementById('produitsAdd')?.classList.add('active');
    }
    event.target.classList.add('active');
}

// ============================================
// DASHBOARD
// ============================================

function loadDashboard() {
    const stats = dataManager.getStats();
    
    document.getElementById('totalProducts').textContent = stats.totalProducts;
    document.getElementById('totalOrders').textContent = stats.totalOrders;
    document.getElementById('totalUsers').textContent = stats.totalUsers;
    document.getElementById('totalRevenue').textContent = stats.totalRevenue.toFixed(2) + '$';

    // Show recent products
    const tbody = document.getElementById('recentProductsTable');
    tbody.innerHTML = '';
    
    dataManager.products.slice(-5).reverse().forEach(product => {
        tbody.innerHTML += `
            <tr>
                <td>
                    <div style="display: flex; align-items: center; gap: 10px;">
                        <img src="${product.image}" style="width: 40px; height: 40px; border-radius: 6px; object-fit: cover;" alt="">
                        <strong>${product.nom}</strong>
                    </div>
                </td>
                <td><span class="badge badge-success">${product.categorie}</span></td>
                <td>${product.reduction}$ <small style="color: #999; text-decoration: line-through;">${product.prix}$</small></td>
                <td>
                    <button class="btn btn-sm btn-secondary" onclick="editProductForm(${product.id})">Modifier</button>
                </td>
            </tr>
        `;
    });
}

// ============================================
// PRODUITS
// ============================================

function loadProducts() {
    const tbody = document.getElementById('productsTable');
    tbody.innerHTML = '';

    dataManager.products.forEach(product => {
        tbody.innerHTML += `
            <tr>
                <td><img src="${product.image}" style="width: 50px; height: 50px; border-radius: 6px; object-fit: cover;" alt=""></td>
                <td><strong>${product.nom}</strong></td>
                <td><span class="badge badge-warning">${product.categorie}</span></td>
                <td>${product.prix}$</td>
                <td>${product.reduction}$</td>
                <td>
                    <button class="btn btn-sm btn-secondary" onclick="editProductForm(${product.id})">Modifier</button>
                    <button class="btn btn-sm btn-danger" onclick="deleteProduct(${product.id})">Supprimer</button>
                </td>
            </tr>
        `;
    });
}

function addProduct(event) {
    event.preventDefault();

    const product = {
        nom: document.getElementById('productName').value,
        description: document.getElementById('productDescription').value,
        prix: parseFloat(document.getElementById('productPrice').value),
        reduction: parseFloat(document.getElementById('productReduction').value),
        image: document.getElementById('productImage').value,
        categorie: document.getElementById('productCategory').value
    };

    dataManager.addProduct(product);

    const msg = document.getElementById('addProductMsg');
    msg.className = 'message success';
    msg.textContent = '✓ Produit ajouté avec succès!';

    document.getElementById('addProductForm').reset();
    loadProducts();

    setTimeout(() => msg.className = 'message', 3000);
}

function editProductForm(productId) {
    const product = dataManager.products.find(p => p.id === productId);
    if (!product) return;

    document.getElementById('editProductId').value = product.id;
    document.getElementById('editProductName').value = product.nom;
    document.getElementById('editProductDescription').value = product.description;
    document.getElementById('editProductPrice').value = product.prix;
    document.getElementById('editProductReduction').value = product.reduction;
    document.getElementById('editProductCategory').value = product.categorie;

    openModal('editProductModal');
}

function updateProduct(event) {
    event.preventDefault();

    const id = parseInt(document.getElementById('editProductId').value);
    const updates = {
        nom: document.getElementById('editProductName').value,
        description: document.getElementById('editProductDescription').value,
        prix: parseFloat(document.getElementById('editProductPrice').value),
        reduction: parseFloat(document.getElementById('editProductReduction').value),
        categorie: document.getElementById('editProductCategory').value
    };

    dataManager.updateProduct(id, updates);
    closeModal('editProductModal');
    loadProducts();
    loadDashboard();

    showMessage('success', '✓ Produit modifié avec succès!');
}

function deleteProduct(productId) {
    if (confirm('Êtes-vous sûr de vouloir supprimer ce produit ?')) {
        dataManager.deleteProduct(productId);
        loadProducts();
        loadDashboard();
        showMessage('success', '✓ Produit supprimé avec succès!');
    }
}

// ============================================
// COMMANDES
// ============================================

function loadOrders() {
    const tbody = document.getElementById('ordersTable');
    tbody.innerHTML = '';

    if (dataManager.orders.length === 0) {
        tbody.innerHTML = '<tr><td colspan="7" style="text-align: center; color: #999;">Aucune commande pour le moment</td></tr>';
        return;
    }

    dataManager.orders.forEach(order => {
        const statusBadge = order.status === 'en attente' ? 
            'badge-warning' : order.status === 'traitée' ? 
            'badge-success' : 'badge-danger';

        tbody.innerHTML += `
            <tr>
                <td><strong>#${order.id}</strong></td>
                <td>${order.client}</td>
                <td>${order.items ? order.items.length : 0} article(s)</td>
                <td><strong>${order.total || 0}$</strong></td>
                <td>${order.date}</td>
                <td><span class="badge ${statusBadge}">${order.status}</span></td>
                <td>
                    <select onchange="updateOrderStatus(${order.id}, this.value)" style="padding: 6px; border-radius: 6px; border: 1px solid #ddd;">
                        <option value="en attente" ${order.status === 'en attente' ? 'selected' : ''}>En attente</option>
                        <option value="traitée" ${order.status === 'traitée' ? 'selected' : ''}>Traitée</option>
                        <option value="annulée" ${order.status === 'annulée' ? 'selected' : ''}>Annulée</option>
                    </select>
                </td>
            </tr>
        `;
    });
}

function updateOrderStatus(orderId, status) {
    dataManager.updateOrderStatus(orderId, status);
    loadOrders();
}

// ============================================
// UTILISATEURS
// ============================================

function loadUsers() {
    dataManager.loadUsers();
    const tbody = document.getElementById('usersTable');
    tbody.innerHTML = '';

    if (dataManager.users.length === 0) {
        tbody.innerHTML = '<tr><td colspan="4" style="text-align: center; color: #999;">Aucun utilisateur enregistré</td></tr>';
        return;
    }

    dataManager.users.forEach(user => {
        tbody.innerHTML += `
            <tr>
                <td>${user.email}</td>
                <td><strong>${user.username}</strong></td>
                <td>${user.registered}</td>
                <td>
                    <button class="btn btn-sm btn-danger" onclick="deleteUser('${user.email}')">Supprimer</button>
                </td>
            </tr>
        `;
    });
}

function deleteUser(email) {
    if (confirm('Êtes-vous sûr de vouloir supprimer cet utilisateur ?')) {
        localStorage.removeItem(email);
        loadUsers();
        showMessage('success', '✓ Utilisateur supprimé!');
    }
}

// ============================================
// MODALS
// ============================================

function openModal(modalId) {
    document.getElementById(modalId).classList.add('show');
}

function closeModal(modalId) {
    document.getElementById(modalId).classList.remove('show');
}

// Close modal on outside click
document.addEventListener('click', (e) => {
    if (e.target.classList.contains('modal')) {
        e.target.classList.remove('show');
    }
});

// ============================================
// MESSAGES
// ============================================

function showMessage(type, text) {
    const allMessages = document.querySelectorAll('.message');
    allMessages.forEach(msg => msg.classList.remove('show'));

    let messageElement = document.querySelector(`.message.${type}`);
    if (messageElement) {
        messageElement.textContent = text;
        messageElement.classList.add('show');
        setTimeout(() => messageElement.classList.remove('show'), 3000);
    }
}

// ============================================
// PARAMÈTRES
// ============================================

function saveSettings(event) {
    event.preventDefault();

    const whatsapp = document.getElementById('whatsappNumber').value;
    const email = document.getElementById('supportEmail').value;
    const newPassword = document.getElementById('newAdminPassword').value;

    localStorage.setItem('admin_whatsapp', whatsapp);
    localStorage.setItem('admin_email', email);

    if (newPassword) {
        localStorage.setItem('admin_password', newPassword);
        showMessage('success', '✓ Paramètres et mot de passe mis à jour!');
    } else {
        showMessage('success', '✓ Paramètres mis à jour!');
    }

    document.getElementById('newAdminPassword').value = '';
}

function exportData() {
    const data = {
        products: dataManager.products,
        orders: dataManager.orders,
        users: dataManager.users,
        exportDate: new Date().toLocaleString('fr-FR')
    };

    const csv = convertToCSV(data);
    downloadCSV(csv, 'technova-data.csv');
    showMessage('success', '✓ Données exportées avec succès!');
}

function convertToCSV(data) {
    let csv = 'EXPORT TECHNOVA RDC\n';
    csv += `Date: ${data.exportDate}\n\n`;

    // Produits
    csv += 'PRODUITS\n';
    csv += 'ID,Nom,Catégorie,Prix Original,Prix Réduit,Image\n';
    data.products.forEach(p => {
        csv += `${p.id},"${p.nom}","${p.categorie}",${p.prix},${p.reduction},"${p.image}"\n`;
    });

    csv += '\nCOMMANDES\n';
    csv += 'ID,Client,Total,Date,Status\n';
    data.orders.forEach(o => {
        csv += `${o.id},"${o.client}",${o.total},"${o.date}","${o.status}"\n`;
    });

    csv += '\nUTILISATEURS\n';
    csv += 'Email,Nom d\'utilisateur,Date d\'inscription\n';
    data.users.forEach(u => {
        csv += `"${u.email}","${u.username}","${u.registered}"\n`;
    });

    return csv;
}

function downloadCSV(csv, filename) {
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

function clearCache() {
    if (confirm('Êtes-vous sûr ? Cette action vide le cache client (favoris, panier, etc.)')) {
        localStorage.removeItem('favoris');
        localStorage.removeItem('cart');
        showMessage('success', '✓ Cache vidé avec succès!');
    }
}
