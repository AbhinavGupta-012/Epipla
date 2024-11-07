// Fetch products from furniture API
async function fetchProducts(category) {
    try {
        const response = await fetch(`https://api.unsplash.com/search/photos?query=${category}&client_id=MIuFsXm_pdrrWzlDJkgna1KcEfobWWCb8whlSip_2rg`);
        const data = await response.json();
        return data.results.map((item, index) => ({
            id: index + 1,
            name: `${category.charAt(0).toUpperCase() + category.slice(1)} ${index + 1}`,
            price: 1500 + (index * 500),
            image: item.urls.small,
            description: item.alt_description || `Beautiful ${category}`
        }));
    } catch (error) {
        console.error('Error fetching products:', error);
        return [];
    }
}

// Display products
function displayProducts(products) {
    const grid = document.querySelector('.product-grid');
    if (!grid) return;

    grid.innerHTML = products.map(product => `
        <div class="product-card">
            <img src="${product.image}" alt="${product.name}">
            <h3>${product.name}</h3>
            <p class="price">₹${product.price.toLocaleString()}</p>
            <p class="description">${product.description}</p>
            <button onclick="addToCart(${JSON.stringify(product)})" class="add-to-cart">Add to Cart</button>
        </div>
    `).join('');
}

// Sort products
function sortProducts(products, method) {
    switch (method) {
        case 'price-low':
            return [...products].sort((a, b) => a.price - b.price);
        case 'price-high':
            return [...products].sort((a, b) => b.price - a.price);
        case 'name':
            return [...products].sort((a, b) => a.name.localeCompare(b.name));
        default:
            return products;
    }
}

// Initialize
document.addEventListener('DOMContentLoaded', async () => {
    const category = document.title.split(' - ')[0].toLowerCase();
    const products = await fetchProducts(category);
    
    const sortSelect = document.getElementById('sort-by');
    if (sortSelect) {
        sortSelect.addEventListener('change', (e) => {
            const sortedProducts = sortProducts(products, e.target.value);
            displayProducts(sortedProducts);
        });
    }

    displayProducts(products);
});