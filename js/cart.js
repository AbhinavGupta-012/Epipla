// Get database reference from global scope
const cartRef = window.db.ref('cart');

// Cart functionality
function updateCartCount() {
    cartRef.once('value')
        .then(snapshot => {
            const cartItems = snapshot.val() || {};
            const totalItems = Object.values(cartItems).reduce((total, item) => total + item.quantity, 0);
            const cartCount = document.querySelector('.cart-count');
            if (cartCount) {
                cartCount.textContent = totalItems;
                cartCount.style.display = totalItems > 0 ? 'flex' : 'none';
            }
        });
}

function addToCart(product) {
    cartRef.child(product.id).once('value')
        .then(snapshot => {
            const existingItem = snapshot.val();
            if (existingItem) {
                return cartRef.child(product.id).update({
                    quantity: existingItem.quantity + 1
                });
            } else {
                return cartRef.child(product.id).set({
                    ...product,
                    quantity: 1
                });
            }
        })
        .then(() => {
            updateCartCount();
            showMessage('Item added to cart!');
        })
        .catch(error => {
            console.error('Error adding to cart:', error);
            showMessage('Error adding item to cart', 'error');
        });
}

function removeFromCart(productId) {
    cartRef.child(productId).remove()
        .then(() => {
            updateCartCount();
            displayCart();
        })
        .catch(error => {
            console.error('Error removing from cart:', error);
        });
}

function updateQuantity(productId, change) {
    cartRef.child(productId).once('value')
        .then(snapshot => {
            const item = snapshot.val();
            if (item) {
                const newQuantity = item.quantity + change;
                if (newQuantity <= 0) {
                    return removeFromCart(productId);
                } else {
                    return cartRef.child(productId).update({
                        quantity: newQuantity
                    });
                }
            }
        })
        .then(() => {
            updateCartCount();
            displayCart();
        })
        .catch(error => {
            console.error('Error updating quantity:', error);
        });
}

function displayCart() {
    const cartContainer = document.getElementById('cart-items');
    const totalItems = document.getElementById('total-items');
    const totalAmount = document.getElementById('total-amount');
    
    if (!cartContainer) return;

    cartRef.once('value')
        .then(snapshot => {
            const cartItems = snapshot.val() || {};
            
            if (Object.keys(cartItems).length === 0) {
                cartContainer.innerHTML = '<div class="empty-cart"><p>Your cart is empty</p></div>';
                if (totalItems) totalItems.textContent = '0';
                if (totalAmount) totalAmount.textContent = '0.00';
                return;
            }
            
            let html = '';
            let total = 0;
            let itemCount = 0;
            
            Object.entries(cartItems).forEach(([id, item]) => {
                total += item.price * item.quantity;
                itemCount += item.quantity;
                html += `
                    <div class="cart-item">
                        <img src="${item.image}" alt="${item.name}">
                        <div class="item-details">
                            <h3>${item.name}</h3>
                            <p>₹${item.price.toFixed(2)}</p>
                        </div>
                        <div class="quantity-controls">
                            <button onclick="updateQuantity('${id}', -1)">-</button>
                            <span>${item.quantity}</span>
                            <button onclick="updateQuantity('${id}', 1)">+</button>
                        </div>
                        <button class="remove-btn" onclick="removeFromCart('${id}')">Remove</button>
                    </div>
                `;
            });
            
            cartContainer.innerHTML = html;
            if (totalItems) totalItems.textContent = itemCount;
            if (totalAmount) totalAmount.textContent = total.toFixed(2);
        })
        .catch(error => {
            console.error('Error displaying cart:', error);
        });
}

function clearCart() {
    cartRef.remove()
        .then(() => {
            updateCartCount();
            showMessage('Cart cleared successfully!');
            if (window.location.pathname.includes('cart.html')) {
                displayCart();
            }
        })
        .catch(error => {
            console.error('Error clearing cart:', error);
            showMessage('Error clearing cart', 'error');
        });
}

function checkout() {
    cartRef.once('value')
        .then(snapshot => {
            if (!snapshot.val()) {
                showMessage('Your cart is empty!', 'error');
                return;
            }
            
            return cartRef.remove()
                .then(() => {
                    showMessage('Thank you for your purchase!');
                    updateCartCount();
                    displayCart();
                });
        })
        .catch(error => {
            console.error('Error during checkout:', error);
            showMessage('Error processing checkout', 'error');
        });
}

function showMessage(message, type = 'success') {
    const messageDiv = document.createElement('div');
    messageDiv.className = `cart-message ${type}`;
    messageDiv.textContent = message;
    document.body.appendChild(messageDiv);
    
    setTimeout(() => {
        messageDiv.remove();
    }, 2000);
}

// Initialize cart display
document.addEventListener('DOMContentLoaded', () => {
    updateCartCount();
    if (window.location.pathname.includes('cart.html')) {
        displayCart();
    }
});