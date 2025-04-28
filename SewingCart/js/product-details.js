document.addEventListener('DOMContentLoaded', function() {
    // Get product ID from URL
    const urlParams = new URLSearchParams(window.location.search);
    const productId = urlParams.get('id');

    if (!productId) {
        window.location.href = 'index.html';
        return;
    }

    // Load product details
    const product = getProductById(productId);
    if (!product) {
        window.location.href = 'index.html';
        return;
    }

    // Display product details
    displayProductDetails(product);
    
    // Load similar products
    loadSimilarProducts(product);

    // Quantity controls
    const quantityInput = document.getElementById('quantity');
    const decreaseBtn = document.getElementById('decreaseQuantity');
    const increaseBtn = document.getElementById('increaseQuantity');

    decreaseBtn.addEventListener('click', () => {
        const currentValue = parseInt(quantityInput.value);
        if (currentValue > 1) {
            quantityInput.value = currentValue - 1;
        }
    });

    increaseBtn.addEventListener('click', () => {
        const currentValue = parseInt(quantityInput.value);
        quantityInput.value = currentValue + 1;
    });

    // Add to cart functionality
    const addToCartBtn = document.getElementById('addToCart');
    addToCartBtn.addEventListener('click', () => {
        const quantity = parseInt(quantityInput.value);
        addToCart(productId, quantity);
        updateCartCount();
        showAddedToCartMessage();
    });
});

function displayProductDetails(product) {
    document.getElementById('productMainImage').src = product.image;
    document.getElementById('productName').textContent = product.name;
    document.getElementById('productPrice').textContent = `₹${product.price.toFixed(2)}`;
    document.getElementById('productDescription').textContent = product.description;
    document.getElementById('stockInfo').textContent = `In Stock: ${product.stock}`;
    
    const category = getCategoryById(product.categoryId);
    if (category) {
        document.getElementById('categoryInfo').textContent = `Category: ${category.name}`;
    }
}

function loadSimilarProducts(currentProduct) {
    const similarProductsContainer = document.getElementById('similarProducts');
    const products = getAllProducts();
    const currentCategory = getCategoryById(currentProduct.categoryId);
    
    // Filter similar products (same category, excluding current product)
    const similarProducts = products.filter(product => 
        product.categoryId === currentProduct.categoryId && 
        product.id !== currentProduct.id
    ).slice(0, 4); // Show up to 4 similar products

    if (similarProducts.length === 0) {
        similarProductsContainer.innerHTML = '<p>No similar products found.</p>';
        return;
    }

    similarProductsContainer.innerHTML = similarProducts.map(product => `
        <div class="product-card">
            <img src="${product.image}" alt="${product.name}">
            <div class="product-card-info">
                <h3>${product.name}</h3>
                <div class="price">₹${product.price.toFixed(2)}</div>
                <a href="product-details.html?id=${product.id}" class="view-details">View Details</a>
            </div>
        </div>
    `).join('');
}

function showAddedToCartMessage() {
    const message = document.createElement('div');
    message.className = 'cart-message';
    message.innerHTML = `
        <i class="fas fa-check-circle"></i>
        <span>Added to cart successfully!</span>
    `;
    document.body.appendChild(message);

    setTimeout(() => {
        message.remove();
    }, 3000);
}

// Add styles for the cart message
const style = document.createElement('style');
style.textContent = `
    .cart-message {
        position: fixed;
        bottom: 20px;
        right: 20px;
        background: #4CAF50;
        color: white;
        padding: 1rem;
        border-radius: 4px;
        display: flex;
        align-items: center;
        gap: 0.5rem;
        animation: slideIn 0.3s ease-out;
    }

    @keyframes slideIn {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
`;
document.head.appendChild(style); 