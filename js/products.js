// Firebase Configuration
const firebaseConfig = {
    apiKey: "AIzaSyC9Me9ZjSvuXrJeMjU-_P_wvMHAkYIk-po",
    authDomain: "epipla-bc50c.firebaseapp.com",
    databaseURL: "https://epipla-bc50c-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "epipla-bc50c",
    storageBucket: "epipla-bc50c.firebasestorage.app",
    messagingSenderId: "1081884443035",
    appId: "1:1081884443035:web:845da94b965ec07f03213e"
  };

// Initialize Firebase
const app = firebase.initializeApp(firebaseConfig);
const db = firebase.database(app);

// Display products
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
            <button class="add-to-cart" onclick='addToCart(${product.id})'>
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

        products.forEach(product => {
            db.ref(`products/${category}/${product.id}`).set(product);
        });

        displayProducts(products);
    } catch (error) {
        console.error('Error fetching and storing products:', error);
    }
}

// Retrieve products from Firebase
function getProductsFromFirebase(category) {
    db.ref(`products/${category}`).once('value', snapshot => {
        const products = [];
        snapshot.forEach(childSnapshot => {
            products.push(childSnapshot.val());
        });

        if (products.length > 0) {
            displayProducts(products);
        } else {
            // Fetch from Unsplash API if Firebase is empty
            fetchAndStoreProducts(category);
        }
    });
}

// Add to Cart function
function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    if (product) {
        console.log(`Added to cart: ${product.name}`);
    } else {
        console.error('Product not found for cart addition');
    }
}

// Initialize products on page load
document.addEventListener('DOMContentLoaded', () => {
    const category = document.title.split(' - ')[0].toLowerCase();
    getProductsFromFirebase(category);
});
