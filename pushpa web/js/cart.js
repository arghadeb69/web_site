// Cart functionality
class Cart {
    constructor() {
        this.cart = [];
        this.cartCount = 0;
        this.loadCart();
        this.setupEventListeners();
    }

    // Load cart from localStorage
    loadCart() {
        const savedCart = localStorage.getItem('matirRupCart');
        if (savedCart) {
            try {
                this.cart = JSON.parse(savedCart);
                this.updateCartCount();
            } catch (e) {
                console.error('Error parsing cart data:', e);
                this.cart = [];
                this.saveCart();
            }
        }
    }

    // Save cart to localStorage
    saveCart() {
        try {
            localStorage.setItem('matirRupCart', JSON.stringify(this.cart));
            this.updateCartCount();
            this.updateCartUI();
        } catch (e) {
            console.error('Error saving cart data:', e);
        }
    }

    // Add item to cart
    addItem(productId, productName, price, quantity = 1, image = '') {
        if (!productId || !productName) {
            console.error('Product ID and name are required');
            return false;
        }

        // Ensure price is a number
        price = parseFloat(price);
        if (isNaN(price)) {
            console.error('Invalid price:', price);
            return false;
        }

        const existingItem = this.cart.find(item => item.id === productId);
        
        if (existingItem) {
            existingItem.quantity += quantity;
        } else {
            this.cart.push({
                id: productId,
                name: productName,
                price: price,
                quantity: quantity,
                image: image || 'url("images/placeholder-product.jpg")'
            });
        }
        
        this.saveCart();
        this.showNotification(`${productName} added to cart`);
        return true;
    }

    // Remove item from cart
    removeItem(productId) {
        const initialLength = this.cart.length;
        this.cart = this.cart.filter(item => item.id !== productId);
        
        if (this.cart.length !== initialLength) {
            this.saveCart();
            return true;
        }
        return false;
    }

    // Update item quantity
    updateQuantity(productId, newQuantity) {
        const item = this.cart.find(item => item.id === productId);
        if (!item) return false;

        newQuantity = parseInt(newQuantity, 10);
        if (isNaN(newQuantity) || newQuantity < 1) return false;

        item.quantity = newQuantity;
        this.saveCart();
        return true;
    }

    // Get cart total
    getCartTotal() {
        return this.cart.reduce((total, item) => total + (item.price * item.quantity), 0);
    }

    // Clear the cart
    clearCart() {
        this.cart = [];
        this.saveCart();
    }

    // Update cart count in the UI
    updateCartCount() {
        this.cartCount = this.cart.reduce((total, item) => total + item.quantity, 0);
        const cartCountElements = document.querySelectorAll('.cart-count');
        cartCountElements.forEach(el => {
            el.textContent = this.cartCount;
            el.style.display = this.cartCount > 0 ? 'flex' : 'none';
        });
    }

    // Update cart UI (for cart page)
    updateCartUI() {
        // This will be handled by the cart page's render function
        if (typeof window.renderCart === 'function') {
            window.renderCart(this.cart);
        }
    }

    // Show notification
    showNotification(message) {
        // Create notification if it doesn't exist
        let notification = document.querySelector('.cart-notification');
        
        if (!notification) {
            notification = document.createElement('div');
            notification.className = 'cart-notification';
            document.body.appendChild(notification);
        }
        
        notification.textContent = message;
        
        // Trigger reflow
        notification.offsetHeight;
        
        // Add show class
        notification.classList.add('show');

        // Remove notification after animation
        clearTimeout(this.notificationTimeout);
        this.notificationTimeout = setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => {
                notification.remove();
            }, 300);
        }, 3000);
    }
    
    // Animate add to cart button
    animateAddToCart(button) {
        button.classList.add('added-to-cart');
        setTimeout(() => {
            button.classList.remove('added-to-cart');
        }, 1000);
    }

    // Setup event listeners
    setupEventListeners() {
        // Add to cart buttons
        document.addEventListener('click', (e) => {
            const addToCartBtn = e.target.closest('.add-to-cart-btn');
            if (!addToCartBtn) return;
            
            // Prevent default form submission if any
            e.preventDefault();
            
            // Get product data from data attributes
            const productId = addToCartBtn.dataset.productId || '';
            const productName = addToCartBtn.dataset.productName || 'Product';
            const price = parseFloat(addToCartBtn.dataset.price) || 0;
            const image = addToCartBtn.dataset.image || '';
            
            // Add to cart with quantity 1
            this.addItem(productId, productName, price, 1, image);
            
            // Add a quick visual feedback
            this.animateAddToCart(addToCartBtn);
        });

        // Cart button in header
        const cartBtn = document.getElementById('cartBtn');
        if (cartBtn) {
            cartBtn.addEventListener('click', (e) => {
                // If we're not on the cart page, navigate to it
                if (!window.location.href.includes('cart.html')) {
                    e.preventDefault();
                    window.location.href = 'cart.html';
                }
            });
        }
    }
}

// Initialize cart when DOM is loaded
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        window.cart = new Cart();
    });
} else {
    window.cart = new Cart();
}

// Make cart globally available
window.Cart = Cart;
