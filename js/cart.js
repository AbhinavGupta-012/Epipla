// Cart functionality
let cart = JSON.parse(localStorage.getItem('cart')) || [];
let cartCount = document.querySelector('.cart-count');

// Update cart count
function updateCartCount() {
    const count = cart.reduce((total, item) => total + item.quantity, 0);
    cartCount = document.querySelector('.cart-count');
    if (cartCount) {
        cartCount.textContent = count;
        cartCount.style.display = count > 0 ? 'block' : 'none';
    }
}

// Add to cart
function addToCart(product) {
    const existingItem = cart.find(item => item.id === product.id);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            id: product.id,
            name: product.name,
            price: product.price,
            image: product.image,
            quantity: 1
        });
    }
    
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
}

// Remove from cart
function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
    displayCart();
}

// Update quantity
function updateQuantity(productId, change) {
    const item = cart.find(item => item.id === productId);
    if (item) {
        item.quantity += change;
        if (item.quantity <= 0) {
            removeFromCart(productId);
        } else {
            localStorage.setItem('cart', JSON.stringify(cart));
            updateCartCount();
            displayCart();
        }
    }
}

// Display cart items
function displayCart() {
    const cartContainer = document.getElementById('cart-items');
    const totalItems = document.getElementById('total-items');
    const totalAmount = document.getElementById('total-amount');
    
    if (!cartContainer) return;
    
    if (cart.length === 0) {
        cartContainer.innerHTML = '<div class="empty-cart"><p>Your cart is empty</p></div>';
        totalItems.textContent = '0';
        totalAmount.textContent = '0';
        return;
    }
    
    let html = '';
    let total = 0;
    let itemCount = 0;
    
    cart.forEach(item => {
        total += item.price * item.quantity;
        itemCount += item.quantity;
        html += `
            <div class="cart-item">
                <img src="${item.image}" alt="${item.name}">
                <div class="item-details">
                    <h3>${item.name}</h3>
                    <p>₹${item.price}</p>
                </div>
                <div class="quantity-controls">
                    <button onclick="updateQuantity(${item.id}, -1)">-</button>
                    <span>${item.quantity}</span>
                    <button onclick="updateQuantity(${item.id}, 1)">+</button>
                </div>
                <button class="remove-btn" onclick="removeFromCart(${item.id})">Remove</button>
            </div>
        `;
    });
    
    cartContainer.innerHTML = html;
    totalItems.textContent = itemCount;
    totalAmount.textContent = total.toFixed(2);
}

// Initialize cart display
updateCartCount();
if (window.location.pathname.includes('cart.html')) {
    displayCart();
}