// Shared Cart Functionality
class SharedCart {
    constructor() {
        this.cart = JSON.parse(localStorage.getItem('cart')) || [];
        this.updateCartCount();
    }

    // Add item to cart
    addToCart(product) {
        const existingItem = this.cart.find(item => item.id === product.id);
        
        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            this.cart.push({
                id: product.id,
                name: product.name,
                price: product.price,
                image: product.image,
                quantity: 1
            });
        }

        this.saveCart();
        this.updateCartCount();
        this.showAddToCartAnimation();
    }

    // Remove item from cart
    removeFromCart(productId) {
        this.cart = this.cart.filter(item => item.id !== productId);
        this.saveCart();
        this.updateCartCount();
    }

    // Update item quantity
    updateQuantity(productId, quantity) {
        const item = this.cart.find(item => item.id === productId);
        if (item) {
            item.quantity = quantity;
            this.saveCart();
            this.updateCartCount();
        }
    }

    // Get cart total
    getCartTotal() {
        return this.cart.reduce((total, item) => total + (item.price * item.quantity), 0);
    }

    // Get cart items
    getCartItems() {
        return this.cart;
    }

    // Save cart to localStorage
    saveCart() {
        localStorage.setItem('cart', JSON.stringify(this.cart));
    }

    // Update cart count in header
    updateCartCount() {
        const cartCount = document.querySelector('.cart-count');
        if (cartCount) {
            const totalItems = this.cart.reduce((total, item) => total + item.quantity, 0);
            cartCount.textContent = totalItems;
        }
    }

    // Show add to cart animation
    showAddToCartAnimation() {
        const cartIcon = document.querySelector('.cart-icon');
        if (cartIcon) {
            cartIcon.classList.add('bounce');
            setTimeout(() => {
                cartIcon.classList.remove('bounce');
            }, 1000);
        }
    }

    // Clear cart
    clearCart() {
        this.cart = [];
        this.saveCart();
        this.updateCartCount();
    }
}

// Initialize shared cart
const sharedCart = new SharedCart();

// Add to cart button click handler
document.addEventListener('click', (e) => {
    if (e.target.classList.contains('add-to-cart')) {
        const productCard = e.target.closest('.product-card');
        if (productCard) {
            const product = {
                id: productCard.dataset.id,
                name: productCard.querySelector('.product-name').textContent,
                price: parseFloat(productCard.dataset.price),
                image: productCard.querySelector('.product-image').src
            };
            sharedCart.addToCart(product);
        }
    }
});

// Add cart icon bounce animation
const style = document.createElement('style');
style.textContent = `
    @keyframes bounce {
        0%, 100% { transform: scale(1); }
        50% { transform: scale(1.2); }
    }
    .cart-icon.bounce {
        animation: bounce 0.5s ease;
    }
`;
document.head.appendChild(style); 