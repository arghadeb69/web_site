// Product Data
const products = {
    'lippan-art': {
        id: 'lippan-art',
        title: 'Lippan Art Wall Hanging',
        price: 2499,
        image: 'images/IMG-20251113-WA0009.jpg',
        category: 'Wall Decor',
        description: 'Beautiful handmade Lippan art with mirror work, perfect for home decoration.'
    },
    'nakshikata': {
        id: 'nakshikata',
        title: 'Wooden Nakshikata Art',
        price: 3499,
        image: 'images/IMG-20251113-WA0010.jpg',
        category: 'Wall Art',
        description: 'Intricately carved wooden Nakshikata art piece, showcasing traditional craftsmanship.'
    },
    'terakuta': {
        id: 'terakuta',
        title: 'Terracotta Set (3 Pcs)',
        price: 1799,
        image: 'images/IMG-20251113-WA0011.jpg',
        category: 'Home Decor',
        description: 'Set of three handcrafted terracotta items, perfect for home decoration.'
    },
    'wallmate': {
        id: 'wallmate',
        title: 'Buddha Wall Decor',
        price: 2999,
        image: 'images/IMG-20251113-WA0012.jpg',
        category: 'Wall Art',
        description: 'Elegant Buddha wall decor, handcrafted with attention to detail.'
    },
    'kalamkari': {
        id: 'kalamkari',
        title: 'Kalamkari Wall Hanging',
        price: 3299,
        image: 'images/IMG-20251113-WA0013.jpg',
        category: 'Textile Art',
        description: 'Traditional Kalamkari art on fabric, perfect for wall decoration.'
    },
    'candle': {
        id: 'candle',
        title: 'Scented Soy Candles',
        price: 1199,
        image: 'images/IMG-20251113-WA0014.jpg',
        category: 'Home Fragrance',
        description: 'Hand-poured soy wax candles with natural essential oils for a soothing ambiance.'
    }
};

// State Management
let currentUser = JSON.parse(localStorage.getItem('currentUser')) || null;
let cart = JSON.parse(localStorage.getItem('cart')) || [];
let wishlist = JSON.parse(localStorage.getItem('wishlist')) || [];

// DOM Elements
const accountBtn = document.getElementById('accountBtn');
const accountModal = document.getElementById('accountModal');
const closeAccountModal = document.querySelector('.close-account-modal');
const loginForm = document.getElementById('loginForm');
const signupForm = document.getElementById('signupForm');
const accountPanel = document.getElementById('accountPanel');
const logoutBtn = document.getElementById('logoutBtn');
const cartBtn = document.getElementById('cartBtn');
const cartSidebar = document.getElementById('cartSidebar');
const closeCart = document.querySelector('.close-cart');
const cartItems = document.getElementById('cartItems');
const cartTotal = document.querySelector('.total-amount');
const checkoutBtn = document.querySelector('.checkout-btn');
const wishlistBtn = document.getElementById('wishlistBtn');

// Initialize the app
function initApp() {
    updateCartCount();
    updateWishlistCount();
    checkAuthState();
    renderCartItems();
    
    // Initialize product modals if on products page
    if (document.querySelector('.product-card')) {
        initProductModals();
    }
}

// Initialize product modals
function initProductModals() {
    document.querySelectorAll('.product-card').forEach(card => {
        card.addEventListener('click', (e) => {
            if (e.target.closest('.view-details') || !e.target.closest('.product-actions')) {
                const productId = card.dataset.productId;
                showProductModal(productId);
            }
        });
    });
}

// Show product modal
function showProductModal(productId) {
    const product = products[productId];
    if (!product) return;
    
    const modal = document.createElement('div');
    modal.className = 'product-modal';
    modal.innerHTML = `
        <div class="modal-content">
            <button class="close-modal">&times;</button>
            <div class="modal-body">
                <div class="modal-image" style="background-image: url('${product.image}')"></div>
                <div class="modal-details">
                    <span class="modal-category">${product.category}</span>
                    <h2 class="modal-title">${product.title}</h2>
                    <div class="modal-rating">
                        ${Array(5).fill('<i class="fas fa-star"></i>').join('')}
                        <span>(24 reviews)</span>
                    </div>
                    <div class="modal-price">₹${product.price.toLocaleString()}</div>
                    <p class="modal-description">${product.description}</p>
                    
                    <div class="modal-specs">
                        <h4>Specifications</h4>
                        <ul class="specs-list">
                            <li><strong>Material:</strong> ${product.material || 'Eco-friendly materials'}</li>
                            <li><strong>Dimensions:</strong> ${product.dimensions || 'Varies by product'}</li>
                            <li><strong>Weight:</strong> ${product.weight || 'Lightweight'}</li>
                            <li><strong>Color:</strong> ${product.color || 'As shown in picture'}</li>
                        </ul>
                    </div>
                    
                    <div class="modal-actions">
                        <div class="quantity-selector">
                            <button class="qty-btn minus">-</button>
                            <input type="number" class="qty-input" value="1" min="1">
                            <button class="qty-btn plus">+</button>
                        </div>
                        <button class="add-to-cart" data-product-id="${product.id}">
                            <i class="fas fa-shopping-cart"></i> Add to Cart
                        </button>
                    </div>
                    
                    <div class="shipping-info">
                        <p><i class="fas fa-truck"></i> Free shipping on orders over ₹2000</p>
                        <p><i class="fas fa-undo"></i> 7-day easy returns</p>
                        <p><i class="fas fa-shield-alt"></i> Secure checkout</p>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    // Add event listeners
    modal.querySelector('.close-modal').addEventListener('click', () => {
        modal.remove();
    });
    
    // Quantity controls
    const qtyInput = modal.querySelector('.qty-input');
    modal.querySelector('.qty-btn.plus').addEventListener('click', () => {
        qtyInput.value = parseInt(qtyInput.value) + 1;
    });
    
    modal.querySelector('.qty-btn.minus').addEventListener('click', () => {
        if (qtyInput.value > 1) {
            qtyInput.value = parseInt(qtyInput.value) - 1;
        }
    });
    
    // Add to cart
    modal.querySelector('.add-to-cart').addEventListener('click', () => {
        const quantity = parseInt(qtyInput.value);
        addToCart(product.id, quantity);
        
        // Show added to cart message
        const btn = modal.querySelector('.add-to-cart');
        const originalText = btn.innerHTML;
        btn.innerHTML = '<i class="fas fa-check"></i> Added to Cart';
        btn.style.backgroundColor = '#4CAF50';
        
        setTimeout(() => {
            btn.innerHTML = originalText;
            btn.style.backgroundColor = '';
        }, 2000);
    });
    
    // Close modal when clicking outside
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.remove();
        }
    });
}

// Check authentication state
function checkAuthState() {
    if (currentUser) {
        const accountText = document.querySelector('.account-text');
        if (accountText) {
            accountText.textContent = currentUser.name.split(' ')[0];
        }
        showAccountPanel();
    } else {
        showLoginForm();
    }
}

// Show login form
function showLoginForm() {
    document.querySelectorAll('.account-form').forEach(form => form.classList.remove('active'));
    const tabs = document.querySelector('.account-tabs');
    if (tabs) tabs.style.display = 'flex';
    if (loginForm) loginForm.classList.add('active');
    if (accountPanel) accountPanel.classList.remove('active');
}

// Show signup form
function showSignupForm() {
    document.querySelectorAll('.account-form').forEach(form => form.classList.remove('active'));
    const tabs = document.querySelector('.account-tabs');
    if (tabs) tabs.style.display = 'flex';
    if (signupForm) signupForm.classList.add('active');
    if (accountPanel) accountPanel.classList.remove('active');
}

// Show account panel
function showAccountPanel() {
    document.querySelectorAll('.account-form').forEach(form => form.classList.remove('active'));
    const tabs = document.querySelector('.account-tabs');
    if (tabs) tabs.style.display = 'none';
    if (accountPanel) accountPanel.classList.add('active');
    
    if (currentUser && accountPanel) {
        const userName = accountPanel.querySelector('.user-name');
        const userEmail = accountPanel.querySelector('.user-email');
        if (userName) userName.textContent = currentUser.name;
        if (userEmail) userEmail.textContent = currentUser.email;
    }
}

// Update cart count
function updateCartCount() {
    const count = cart.reduce((total, item) => total + item.quantity, 0);
    const cartCount = document.querySelector('.cart-count');
    if (cartCount) {
        cartCount.textContent = count;
        cartCount.style.display = count > 0 ? 'flex' : 'none';
    }
}

// Update wishlist count
function updateWishlistCount() {
    const count = wishlist.length;
    const wishlistCount = document.querySelector('.wishlist-count');
    if (wishlistCount) {
        wishlistCount.textContent = count;
        wishlistCount.style.display = count > 0 ? 'flex' : 'none';
    }
}

// Add to cart
function addToCart(productId, quantity = 1) {
    const existingItem = cart.find(item => item.id === productId);
    
    if (existingItem) {
        existingItem.quantity += quantity;
    } else {
        cart.push({
            id: productId,
            quantity: quantity
        });
    }
    
    saveCart();
    updateCartCount();
    renderCartItems();
    
    // Show add to cart notification
    showNotification('Item added to cart!');
}

// Show notification
function showNotification(message) {
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;
    document.body.appendChild(notification);
    
    // Add show class after a small delay for the animation
    setTimeout(() => {
        notification.classList.add('show');
    }, 10);
    
    // Remove notification after 3 seconds
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 3000);
}

// Remove from cart
function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    saveCart();
    updateCartCount();
    renderCartItems();}

// Update cart quantity
function updateCartItemQuantity(productId, quantity) {
    const item = cart.find(item => item.id === productId);
    if (item) {
        item.quantity = quantity;
        saveCart();
        renderCartItems();
    }
}

// Save cart to localStorage
function saveCart() {
    localStorage.setItem('cart', JSON.stringify(cart));
}

// Render cart items
function renderCartItems() {
    if (!cartItems) return;
    
    if (cart.length === 0) {
        cartItems.innerHTML = `
            <div class="empty-cart">
                <i class="fas fa-shopping-cart"></i>
                <p>Your cart is empty</p>
                <a href="products.html" class="btn">Continue Shopping</a>
            </div>
        `;
        if (checkoutBtn) checkoutBtn.disabled = true;
        if (cartTotal) cartTotal.textContent = '₹0';
        return;
    }
    
    let total = 0;
    let itemsHTML = '';
    
    cart.forEach(item => {
        const product = products[item.id];
        if (!product) return;
        
        const itemTotal = product.price * item.quantity;
        total += itemTotal;
        
        itemsHTML += `
            <div class="cart-item">
                <img src="${product.image}" alt="${product.title}" class="cart-item-img">
                <div class="cart-item-details">
                    <h4>${product.title}</h4>
                    <div class="cart-item-price">₹${product.price.toLocaleString()}</div>
                    <div class="cart-item-quantity">
                        <button class="qty-btn minus" data-id="${product.id}">-</button>
                        <input type="number" value="${item.quantity}" min="1" class="qty-input" data-id="${product.id}">
                        <button class="qty-btn plus" data-id="${product.id}">+</button>
                    </div>
                </div>
                <button class="remove-item" data-id="${product.id}">
                    <i class="fas fa-times"></i>
                </button>
            </div>
        `;
    });
    
    cartItems.innerHTML = itemsHTML;
    if (cartTotal) cartTotal.textContent = `₹${total.toLocaleString()}`;
    if (checkoutBtn) checkoutBtn.disabled = false;
    
    // Add event listeners to quantity controls
    document.querySelectorAll('.qty-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const productId = e.target.closest('.qty-btn').dataset.id;
            const input = document.querySelector(`.qty-input[data-id="${productId}"]`);
            if (!input) return;
            
            let quantity = parseInt(input.value);
            
            if (e.target.classList.contains('plus')) {
                quantity++;
            } else if (e.target.classList.contains('minus') && quantity > 1) {
                quantity--;
            }
            
            input.value = quantity;
            updateCartItemQuantity(productId, quantity);
        });
    });
    
    // Add event listeners to remove buttons
    document.querySelectorAll('.remove-item').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const productId = e.target.closest('.remove-item').dataset.id;
            removeFromCart(productId);
        });
    });
}

// Toggle wishlist
function toggleWishlist(productId) {
    const index = wishlist.indexOf(productId);
    
    if (index === -1) {
        wishlist.push(productId);
    } else {
        wishlist.splice(index, 1);
    }
    
    localStorage.setItem('wishlist', JSON.stringify(wishlist));
    updateWishlistCount();
}

// Event Listeners
document.addEventListener('DOMContentLoaded', () => {
    initApp();
    
    // Account modal
    if (accountBtn) {
        accountBtn.addEventListener('click', (e) => {
            e.preventDefault();
            if (accountModal) accountModal.classList.add('active');
        });
    }
    
    if (closeAccountModal) {
        closeAccountModal.addEventListener('click', () => {
            if (accountModal) accountModal.classList.remove('active');
        });
    }
    
    // Switch between login and signup forms
    document.querySelectorAll('.switch-tab').forEach(tab => {
        tab.addEventListener('click', (e) => {
            e.preventDefault();
            const tabName = e.target.dataset.tab;
            
            if (tabName === 'login') {
                showLoginForm();
            } else if (tabName === 'signup') {
                showSignupForm();
            }
        });
    });
    
    // Tab switching
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            if (btn.dataset.tab === 'login') {
                showLoginForm();
            } else {
                showSignupForm();
            }
        });
    });
    
    // Login form submission
    if (loginForm) {
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const email = document.getElementById('loginEmail')?.value;
            const password = document.getElementById('loginPassword')?.value;
            
            if (!email || !password) {
                showNotification('Please fill in all fields');
                return;
            }
            
            // In a real app, you would validate credentials with a server
            // For demo purposes, we'll just create a user object
            currentUser = {
                name: email.split('@')[0],
                email: email
            };
            
            localStorage.setItem('currentUser', JSON.stringify(currentUser));
            checkAuthState();
            if (accountModal) accountModal.classList.remove('active');
            showNotification('Logged in successfully!');
        });
    }
    
    // Signup form submission
    if (signupForm) {
        signupForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const name = document.getElementById('signupName')?.value;
            const email = document.getElementById('signupEmail')?.value;
            const password = document.getElementById('signupPassword')?.value;
            const confirmPassword = document.getElementById('confirmPassword')?.value;
            
            if (!name || !email || !password || !confirmPassword) {
                showNotification('Please fill in all fields');
                return;
            }
            
            if (password !== confirmPassword) {
                showNotification('Passwords do not match');
                return;
            }
            
            // In a real app, you would create a new user account on the server
            currentUser = {
                name: name,
                email: email
            };
            
            localStorage.setItem('currentUser', JSON.stringify(currentUser));
            checkAuthState();
            if (accountModal) accountModal.classList.remove('active');
            showNotification('Account created successfully!');
        });
    }
    
    // Logout
    if (logoutBtn) {
        logoutBtn.addEventListener('click', (e) => {
            e.preventDefault();
            currentUser = null;
            localStorage.removeItem('currentUser');
            checkAuthState();
            showLoginForm();
            showNotification('Logged out successfully');
        });
    }
    
    // Cart sidebar
    if (cartBtn) {
        cartBtn.addEventListener('click', (e) => {
            e.preventDefault();
            if (cartSidebar) cartSidebar.classList.add('active');
        });
    }
    
    if (closeCart) {
        closeCart.addEventListener('click', () => {
            if (cartSidebar) cartSidebar.classList.remove('active');
        });
    }
    
    // Close modals when clicking outside
    window.addEventListener('click', (e) => {
        if (e.target === accountModal) {
            accountModal.classList.remove('active');
        }
        if (e.target === cartSidebar) {
            cartSidebar.classList.remove('active');
        }
    });
    
    // Checkout button
    if (checkoutBtn) {
        checkoutBtn.addEventListener('click', () => {
            if (cart.length === 0) return;
            
            if (!currentUser) {
                if (accountModal) accountModal.classList.add('active');
                showLoginForm();
                return;
            }
            
            // In a real app, you would redirect to checkout
            showNotification('Proceeding to checkout');
        });
    }
    
    // Wishlist button
    if (wishlistBtn) {
        wishlistBtn.addEventListener('click', (e) => {
            e.preventDefault();
            if (!currentUser) {
                if (accountModal) accountModal.classList.add('active');
                showLoginForm();
            } else {
                // In a real app, you would show the wishlist page
                showNotification('Wishlist feature coming soon!');
            }
        });
    }
});

// Add to cart buttons on product details page
document.addEventListener('click', (e) => {
    if (e.target.closest('.add-to-cart')) {
        const button = e.target.closest('.add-to-cart');
        const productId = button.dataset.productId;
        const quantityInput = button.closest('.product-actions')?.querySelector('.qty-input');
        const quantity = quantityInput ? parseInt(quantityInput.value) : 1;
        
        addToCart(productId, quantity);
    }
});
