// ==========================================================================
// ASLUCKYY STORE - FREE FIRE ID MANAGEMENT SYSTEM
// Edit the array below to add, modify, or remove Free Fire IDs from your store.
// ==========================================================================

const WHATSAPP_NUMBER = "918679558714";

const products = [
    {
        id: "FF-001",
        title: "Level 75 Elite Pass Account | Hip Hop & Sakura",
        price: 4999,
        image: "https://via.placeholder.com/400x250/121218/ff2e4d?text=FF+ID+Level+75",
        description: "Level 75 super rare account with Season 1 & 2 Elite Passes, Hip Hop Bundle, Sakura Set, Cobra MP40 Max, and 50+ Evo Weapon Skins.",
        status: "Available"
    },
    {
        id: "FF-002",
        title: "Level 71 Old Account | Bunny Warrior Set",
        price: 2999,
        image: "https://via.placeholder.com/400x250/121218/ff2e4d?text=FF+ID+Level+71",
        description: "Level 71 OG Account. Features Bunny Warrior Set, Breakdancer Bundle, Poker MP40, and Grandmaster Banner.",
        status: "Available"
    },
    {
        id: "FF-003",
        title: "Level 68 Evo Max Account | AK Dragon Max",
        price: 1999,
        image: "https://via.placeholder.com/400x250/121218/ff2e4d?text=FF+ID+Level+68",
        description: "Level 68 account focused on gun skins. Draco AK Level 7 Max, M1887 Rapper Underworld, and 12+ Legend Outfits.",
        status: "Sold"
    },
    {
        id: "FF-004",
        title: "Level 78 Stacked ID | Criminal Bundle Full Set",
        price: 7500,
        image: "https://via.placeholder.com/400x250/121218/ff2e4d?text=FF+ID+Level+78",
        description: "Ultra stacked Level 78 account with Red, Green, and Purple Criminal Bundles. Full collection of emotes and 80+ gun skins.",
        status: "Available"
    }
];

// Hide preloader when page finishes loading
window.addEventListener('load', () => {
    const preloader = document.getElementById('preloader');
    if (preloader) {
        preloader.style.opacity = '0';
        setTimeout(() => preloader.style.display = 'none', 500);
    }
});

// Main Rendering Engine
function renderProducts() {
    const grid = document.getElementById('product-grid');
    if (!grid) return;
    
    grid.innerHTML = '';

    if (products.length === 0) {
        grid.innerHTML = `<p style="grid-column: 1/-1; text-align:center; color: var(--text-muted); padding: 40px;">No Free Fire IDs currently listed.</p>`;
        return;
    }

    products.forEach(p => {
        const card = createProductCard(p);
        grid.appendChild(card);
    });
}

// Function to create each product card element
function createProductCard(product) {
    const card = document.createElement('div');
    card.className = 'product-card';

    // WhatsApp Message Encoding
    const message = `Hi ASLUCKYY STORE, I want to buy this Free Fire ID:\n\nTitle: ${product.title}\nPrice: ₹${product.price}\nID Code: ${product.id}`;
    const waLink = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;

    const isSold = product.status.toLowerCase() === 'sold';

    card.innerHTML = `
        <div class="card-img">
            <img src="${product.image}" alt="${product.title}" onerror="this.src='https://via.placeholder.com/400x250/121218/ff2e4d?text=ASLUCKYY+STORE'">
        </div>
        <div class="card-body">
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom: 8px;">
                <span class="badge">Free Fire ID</span>
                <span class="badge ${isSold ? 'badge-sold' : ''}">${product.status}</span>
            </div>
            <h3 class="card-title">${product.title}</h3>
            <p class="card-desc">${product.description}</p>
            <div class="card-footer">
                <div class="price-tag">₹${Number(product.price).toLocaleString()}</div>
                <div>
                    ${!isSold ? 
                        `<a href="${waLink}" target="_blank" class="btn btn-whatsapp"><i class="fa-brands fa-whatsapp"></i> Buy Now</a>` : 
                        `<button class="btn btn-outline" disabled style="opacity: 0.5; cursor: not-allowed;">Sold Out</button>`
                    }
                </div>
            </div>
        </div>
    `;

    return card;
}

// Mobile Hamburger Navigation Handler
document.addEventListener('DOMContentLoaded', () => {
    const hamburger = document.getElementById('hamburger');
    const navLinks = document.getElementById('nav-links');

    if (hamburger && navLinks) {
        hamburger.addEventListener('click', () => {
            navLinks.classList.toggle('active');
        });
    }

    // Render products on DOM readiness
    renderProducts();
});
