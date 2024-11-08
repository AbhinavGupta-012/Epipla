// Get database reference from global scope
function displayProducts(products) {
    const grid = document.getElementById('chairs-grid');
    if (!grid) return;

    grid.innerHTML = products.map(product => `
        <div class="product-card">
            <img src="${product.image}" alt="${product.name}">
            <div class="product-info">
                <h3>${product.name}</h3>
                <p class="price">₹${product.price.toFixed(2)}</p>
                <p class="description">${product.description}</p>
            </div>
            <button class="add-to-cart" onclick="addToCart(${JSON.stringify(product).replace(/"/g, '&quot;')})">
                Add to Cart
            </button>
        </div>
    `).join('');
}

// Fetch products from API and store in Firebase
async function fetchAndStoreProducts(category) {
    try {
        const response = await fetch(`https://api.unsplash.com/search/photos?query=${category}&client_id=MIuFsXm_pdrrWzlDJkgna1KcEfobWWCb8whlSip_2rg`);
        const data = await response.json();

        const products = data.results.map((item, index) => ({
            id: index + 1,
            name: `${category.charAt(0).toUpperCase() + category.slice(1)} ${index + 1}`,
            price: 1500 + (index * 500),
            image: item.urls.small,
            description: item.alt_description || `Beautiful ${category}`
        }));

        const updates = {};
        products.forEach(product => {
            updates[`products/${category}/${product.id}`] = product;
        });

        await window.db.ref().update(updates);
        displayProducts(products);
    } catch (error) {
        console.error('Error fetching and storing products:', error);
    }
}

// Retrieve products from Firebase
function getProductsFromFirebase(category) {
    window.db.ref(`products/${category}`).once('value')
        .then(snapshot => {
            const products = [];
            snapshot.forEach(childSnapshot => {
                products.push(childSnapshot.val());
            });

            if (products.length > 0) {
                displayProducts(products);
            } else {
                fetchAndStoreProducts(category);
            }
        })
        .catch(error => {
            console.error('Error retrieving products:', error);
        });
}

// Initialize products on page load
document.addEventListener('DOMContentLoaded', async () => {
    const category = document.title.split(' - ')[0].toLowerCase();
    const products = await getProductsFromFirebase(category);

    const sortSelect = document.getElementById('sort-by');
    if (sortSelect) {
        sortSelect.addEventListener('change', (e) => {
            const sortedProducts = sortProducts(products, e.target.value);
            displayProducts(sortedProducts);
        });
    }
    displayProducts(products);
});
