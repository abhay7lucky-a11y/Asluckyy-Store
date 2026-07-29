/* ==========================================================================
   ASLUCKYY STORE - SCRIPT
   ========================================================================== */

const defaultProducts = [
  {
    id: 'ff-id-2802654192',
    title: 'Free Fire Lv.68 (Green Criminal + Evo Guns)',
    category: 'freefire',
    price: 2999,
    status: 'Available',
    featured: true,
    imageUrl: 'https://i.ibb.co/sph31HRf/129132.jpg',
    description: '🔥 UID: 2802654192 | Level 68 | 👑 Green Criminal Bundle | 🔫 Evo M1014 Lv.3, Evo FAMAS, Evo MP5 | Crazy Bunny MP40 | 💃 Pushpa Chair Emote + Spear Spin (36+ Total Emotes) | 🎥 Full Video Proof Available on WhatsApp | 🛡️ 100% Safe Deal & Full Access.'
  }
];

document.addEventListener('DOMContentLoaded', () => {
  const productGrid = document.getElementById('productGrid');
  const filterBtns = document.querySelectorAll('.filter-btn');

  function renderProducts(category = 'all') {
    if (!productGrid) return;
    productGrid.innerHTML = '';

    const filtered = category === 'all' 
      ? defaultProducts 
      : defaultProducts.filter(p => p.category === category);

    if (filtered.length === 0) {
      productGrid.innerHTML = '<p style="text-align:center; grid-column: 1/-1; padding: 2rem;">Is category mein abhi koi product nahi hai.</p>';
      return;
    }

    filtered.forEach(product => {
      const card = document.createElement('div');
      card.className = 'product-card';
      card.innerHTML = `
        <div class="product-image">
          <img src="${product.imageUrl}" alt="${product.title}">
          <span class="badge ${product.status.toLowerCase()}">${product.status}</span>
        </div>
        <div class="product-info">
          <h3>${product.title}</h3>
          <p class="price">₹${product.price}</p>
          <p class="description">${product.description}</p>
          <a href="https://wa.me/?text=Hi,%20I%20want%20to%20buy%20${encodeURIComponent(product.title)}" target="_blank" class="buy-btn">Buy Now</a>
        </div>
      `;
      productGrid.appendChild(card);
    });
  }

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const category = btn.getAttribute('data-category');
      renderProducts(category);
    });
  });

  renderProducts();
});
