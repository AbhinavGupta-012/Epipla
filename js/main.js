// Search functionality
const searchContainer = document.querySelector('.search-container');
const searchIcon = document.querySelector('.search-icon');
const searchInput = document.querySelector('#search');

searchIcon.addEventListener('click', () => {
    searchInput.focus();
});

// Close search when clicking outside
document.addEventListener('click', (e) => {
    if (!searchContainer.contains(e.target)) {
        searchInput.blur();
    }
});

// Load featured products
const featuredProducts = [
    {
        id: 1,
        name: 'Modern Accent Chair',
        price: 12999,
        image: 'images/products/chair-1.jpg'
    },
    {
        id: 2,
        name: 'Dining Table Set',
        price: 34999,
        image: 'images/products/table-1.jpg'
    },
    {
        id: 3,
        name: 'Leather Sofa',
        price: 49999,
        image: 'images/products/sofa-1.jpg'
    },
    // Add more products as needed
];

function loadFeaturedProducts() {
    const productGrid = document.querySelector('.product-grid');
    if (!productGrid) return;

    productGrid.innerHTML = featuredProducts.map(product => `
        <div class="product-card">
            <img src="${product.image}" alt="${product.name}">
            <h3>${product.name}</h3>
            <p class="price">₹${product.price.toLocaleString()}</p>
            <button onclick="addToCart(${product.id})" class="add-to-cart">Add to Cart</button>
        </div>
    `).join('');
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    loadFeaturedProducts();
});