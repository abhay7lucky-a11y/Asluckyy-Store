/* ==========================================================================
   ASLUCKYY STORE - COMPLETE JAVASCRIPT & FIREBASE INTEGRATION
   ========================================================================== */

// 1. Firebase Configuration
// Replace the values below with your official Firebase Project credentials from Firebase Console
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT_ID.appspot.com",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID"
};

// Initialize Firebase SDK
firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.firestore();
const storage = firebase.storage();

// Local State Store
let products = [];
let activeCategory = 'all';
let searchQuery = '';

// DOM Elements
const preloader = document.getElementById('preloader');
const productGrid = document.getElementById('productGrid');
const searchInput = document.getElementById('searchInput');
const searchBtn = document.getElementById('searchBtn');
const filterBtns = document.querySelectorAll('.filter-btn');
const hamburgerBtn = document.getElementById('hamburgerBtn');
const navLinks = document.getElementById('navLinks');
const backToTopBtn = document.getElementById('backToTopBtn');

// Admin Elements
const adminModal = document.getElementById('adminModal');
const openAdminModalBtn = document.getElementById('openAdminModalBtn');
const closeAdminModalBtn = document.getElementById('closeAdminModalBtn');
const adminLoginForm = document.getElementById('adminLoginForm');
const adminLoginView = document.getElementById('adminLoginView');
const adminDashboardView = document.getElementById('adminDashboardView');
const adminLogoutBtn = document.getElementById('adminLogoutBtn');
const productForm = document.getElementById('productForm');
const adminProductsList = document.getElementById('adminProductsList');
const cancelEditBtn = document.getElementById('cancelEditBtn');

// Fallback Demo Products (Shown when Firestore is empty/not configured)
const defaultProducts = [
  {
    id: 'demo-1',
    title: 'Free Fire Old ID (Hip Hop + S2)',
    category: 'freefire',
    price: 4999,
    status: 'Available',
    featured: true,
    imageUrl: 'https://images.unsplash.com/photo-1538481199705-c710c4e965fc?auto=format&fit=crop&w=600&q=80',
    description: 'Level 71 account. Includes rare bundles, evo gun skins at max level, and high status badges.'
  },
  {
    id: 'demo-2',
    title: 'Gaming & Tech YouTube Channel',
    category: 'youtube',
    price: 12500,
    status: 'Available',
    featured: true,
    imageUrl: 'https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?auto=format&fit=crop&w=600&q=80',
    description: '45,000 active subscribers. Fully monetized, active community, zero copyright strikes.'
  },
  {
    id: 'demo-3',
    title: 'Esports & Gaming Instagram Page',
    category: 'instagram',
    price: 3200,
    status: 'Sold',
    featured: false,
    imageUrl: 'https://images.unsplash.com/photo-1611262588024-d12430b98920?auto=format&fit=crop&w=600&q=80',
    description: '28k followers, high organic engagement rate, gaming meme niche.'
  }
];

/* --------------------------------------------------------------------------
   Initialization & Event Listeners
   -------------------------------------------------------------------------- */
window.addEventListener('DOMContentLoaded', () => {
  // Hide preloader
  setTimeout(() => {
    preloader.style.opacity = '0';
    setTimeout(() => preloader.style.display = 'none', 500);
  }, 800);

  // Load products from Firestore
  fetchProductsFromFirestore();

  // Navigation Mobile Toggle
  hamburgerBtn.addEventListener('click', () => {
    navLinks.classList.toggle('active');
  });

  // Smooth Navigation Link Highlight
  document.querySelectorAll('.nav-item').forEach(item => {
    item.addEventListener('click', () => {
      navLinks.classList.remove('active');
    });
  });

  // Back to Top Button Logic
  window.addEventListener('scroll', () => {
    if (window.scrollY > 400) {
      backToTopBtn.style.display = 'flex';
    } else {
      backToTopBtn.style.display = 'none';
    }
  });

  backToTopBtn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  // Search Functionality
  searchBtn.addEventListener('click', executeSearch);
  searchInput.addEventListener('keyup', (e) => {
    if (e.key === 'Enter') executeSearch();
  });

  // Category Filter Functionality
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      activeCategory = btn.getAttribute('data-category');
      renderProducts();
    });
  });

  // FAQ Accordion Toggle
  document.querySelectorAll('.faq-item').forEach(item => {
    item.addEventListener('click', () => {
      item.classList.toggle('active');
    });
  });

  // Admin Modal Controls
  openAdminModalBtn.addEventListener('click', () => adminModal.style.display = 'flex');
  closeAdminModalBtn.addEventListener('click', () => adminModal.style.display = 'none');

  // Firebase Auth Listener
  auth.onAuthStateChanged(user => {
    if (user) {
      adminLoginView.classList.add('hidden');
      adminDashboardView.classList.remove('hidden');
      renderAdminProductList();
    } else {
      adminLoginView.classList.remove('hidden');
      adminDashboardView.classList.add('hidden');
    }
  });

  // Admin Login
  adminLoginForm.addEventListener('submit', handleAdminLogin);
  adminLogoutBtn.addEventListener('click', () => auth.signOut());

  // Product Add / Edit Form Submit
  productForm.addEventListener('submit', handleProductFormSubmit);
  cancelEditBtn.addEventListener('click', resetProductForm);
});

/* --------------------------------------------------------------------------
   Firestore Data Operations
   -------------------------------------------------------------------------- */
function fetchProductsFromFirestore() {
  db.collection('products').onSnapshot(snapshot => {
    const fetchedProducts = [];
    snapshot.forEach(doc => {
      fetchedProducts.push({ id: doc.id, ...doc.data() });
    });

    if (fetchedProducts.length > 0) {
      products = fetchedProducts;
    } else {
      // Fallback if collection is empty
      products = defaultProducts;
    }
    
    updateCategoryCounts();
    renderProducts();
    if (!adminDashboardView.classList.contains('hidden')) {
      renderAdminProductList();
    }
  }, error => {
    console.warn("Firestore access error/unconfigured config. Showing demo inventory:", error);
    products = defaultProducts;
    updateCategoryCounts();
    renderProducts();
  });
}

/* --------------------------------------------------------------------------
   UI Render Functions
   -------------------------------------------------------------------------- */
function executeSearch() {
  searchQuery = searchInput.value.toLowerCase().trim();
  renderProducts();
}

function updateCategoryCounts() {
  document.getElementById('count-all').textContent = `${products.length} Items`;
  document.getElementById('count-freefire').textContent = `${products.filter(p => p.category === 'freefire').length} Items`;
  document.getElementById('count-youtube').textContent = `${products.filter(p => p.category === 'youtube').length} Items`;
  document.getElementById('count-instagram').textContent = `${products.filter(p => p.category === 'instagram').length} Items`;
}

function renderProducts() {
  productGrid.innerHTML = '';

  const filtered = products.filter(item => {
    const matchesCategory = (activeCategory === 'all') || (item.category === activeCategory);
    const matchesSearch = item.title.toLowerCase().includes(searchQuery) || 
                          item.description.toLowerCase().includes(searchQuery);
    return matchesCategory && matchesSearch;
  });

  if (filtered.length === 0) {
    productGrid.innerHTML = `
      <div style="grid-column: 1/-1; text-align: center; color: var(--text-muted); padding: 40px;">
        <i class="fa-solid fa-box-open" style="font-size: 3rem; color: var(--primary-red); margin-bottom: 10px;"></i>
        <p>No inventory items match your criteria.</p>
      </div>`;
    return;
  }

  filtered.forEach(item => {
    const card = document.createElement('div');
    card.className = 'product-card glass-card';

    const whatsappText = encodeURIComponent(`Hello ASLUCKYY STORE, I am interested in purchasing: "${item.title}" (ID: ${item.id}) priced at ₹${item.price}. Please provide transfer details.`);
    const buyUrl = `https://wa.me/918679558714?text=${whatsappText}`;

    card.innerHTML = `
      ${item.featured ? '<div class="product-badge-featured"><i class="fa-solid fa-star"></i> Featured</div>' : ''}
      <div class="product-status-tag ${item.status === 'Available' ? 'status-available' : 'status-sold'}">
        ${item.status}
      </div>
      <div class="product-img-wrap">
        <img src="${item.imageUrl || 'https://via.placeholder.com/300x180/121218/ff003c?text=ASLUCKYY+STORE'}" alt="${item.title}" class="product-img">
      </div>
      <div class="product-body">
        <span class="product-cat">${item.category}</span>
        <h3 class="product-title">${item.title}</h3>
        <p class="product-desc">${item.description}</p>
        <div class="product-footer">
          <div class="product-price">₹${item.price}</div>
          ${item.status === 'Available' 
            ? `<a href="${buyUrl}" target="_blank" class="btn primary-btn sm-btn"><i class="fa-brands fa-whatsapp"></i> Buy Now</a>` 
            : `<button disabled class="btn secondary-btn sm-btn" style="opacity:0.5; cursor:not-allowed;">Sold Out</button>`
          }
        </div>
      </div>
    `;

    productGrid.appendChild(card);
  });
}

/* --------------------------------------------------------------------------
   Admin Operations
   -------------------------------------------------------------------------- */
function handleAdminLogin(e) {
  e.preventDefault();
  const email = document.getElementById('adminEmail').value;
  const password = document.getElementById('adminPassword').value;

  auth.signInWithEmailAndPassword(email, password)
    .then(() => {
      alert("Successfully logged in!");
      adminLoginForm.reset();
    })
    .catch(err => {
      alert("Admin Login Failed: " + err.message);
    });
}

async function handleProductFormSubmit(e) {
  e.preventDefault();

  const id = document.getElementById('productId').value;
  const title = document.getElementById('prodTitle').value;
  const category = document.getElementById('prodCategory').value;
  const price = Number(document.getElementById('prodPrice').value);
  const status = document.getElementById('prodStatus').value;
  const featured = document.getElementById('prodFeatured').checked;
  const description = document.getElementById('prodDescription').value;
  
  const fileInput = document.getElementById('prodImageFile');
  let imageUrl = document.getElementById('prodImageUrl').value;

  // Handle Firebase Storage Image Upload if file selected
  if (fileInput.files.length > 0) {
    const file = fileInput.files[0];
    const storageRef = storage.ref(`products/${Date.now()}_${file.name}`);
    try {
      const snapshot = await storageRef.put(file);
      imageUrl = await snapshot.ref.getDownloadURL();
    } catch (error) {
      alert("Image upload failed, using URL fallback: " + error.message);
    }
  }

  if (!imageUrl) {
    imageUrl = 'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=600&q=80';
  }

  const productData = {
    title,
    category,
    price,
    status,
    featured,
    description,
    imageUrl,
    updatedAt: firebase.firestore.FieldValue.serverTimestamp()
  };

  if (id) {
    // Update existing document
    db.collection('products').doc(id).update(productData)
      .then(() => alert("Product updated successfully!"))
      .catch(err => alert("Error updating: " + err.message));
  } else {
    // Add new document
    db.collection('products').add(productData)
      .then(() => alert("New product added to store!"))
      .catch(err => alert("Error adding: " + err.message));
  }

  resetProductForm();
}

function renderAdminProductList() {
  adminProductsList.innerHTML = '';
  products.forEach(p => {
    const itemRow = document.createElement('div');
    itemRow.className = 'admin-item-row';
    itemRow.innerHTML = `
      <div>
        <strong>${p.title}</strong> - ₹${p.price} (${p.status})
      </div>
      <div class="admin-actions">
        <button class="btn secondary-btn sm-btn" onclick="editProduct('${p.id}')"><i class="fa-solid fa-pen"></i></button>
        <button class="btn primary-btn sm-btn" onclick="deleteProduct('${p.id}')"><i class="fa-solid fa-trash"></i></button>
      </div>
    `;
    adminProductsList.appendChild(itemRow);
  });
}

window.editProduct = function(id) {
  const prod = products.find(p => p.id === id);
  if (!prod) return;

  document.getElementById('productId').value = prod.id;
  document.getElementById('prodTitle').value = prod.title;
  document.getElementById('prodCategory').value = prod.category;
  document.getElementById('prodPrice').value = prod.price;
  document.getElementById('prodStatus').value = prod.status;
  document.getElementById('prodFeatured').checked = prod.featured;
  document.getElementById('prodImageUrl').value = prod.imageUrl;
  document.getElementById('prodDescription').value = prod.description;

  document.getElementById('formTitle').textContent = "Edit Inventory Item";
  cancelEditBtn.classList.remove('hidden');
};

window.deleteProduct = function(id) {
  if (confirm("Are you sure you want to delete this product?")) {
    db.collection('products').doc(id).delete()
      .then(() => alert("Item deleted!"))
      .catch(err => alert("Delete error: " + err.message));
  }
};

function resetProductForm() {
  productForm.reset();
  document.getElementById('productId').value = '';
  document.getElementById('formTitle').textContent = "Add New Inventory Item";
  cancelEditBtn.classList.add('hidden');
}
