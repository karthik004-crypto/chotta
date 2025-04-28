// Product data structure
const products = {
    'internal-parts': [
        {
            id: 'int1',
            name: 'Internal Part 1',
            price: '₹12.99',
            image: 'images/internal1.jpg'
        },
        {
            id: 'int2',
            name: 'Internal Part 2',
            price: '₹15.99',
            image: 'images/internal2.jpg'
        },
        {
            id: 'int3',
            name: 'Internal Part 3',
            price: '₹9.99',
            image: 'images/internal3.jpg'
        }
    ],
    'spare-parts': [
        {
            id: 'spare1',
            name: 'Spare Part 1',
            price: '₹8.99',
            image: 'images/spare1.jpg'
        },
        {
            id: 'spare2',
            name: 'Spare Part 2',
            price: '₹11.99',
            image: 'images/spare2.jpg'
        },
        {
            id: 'spare3',
            name: 'Spare Part 3',
            price: '₹10.99',
            image: 'images/spare3.jpg'
        }
    ],
    'folders': [
        {
            id: 'folder1',
            name: 'Folder 1',
            price: '₹6.99',
            image: 'images/folder1.jpg'
        },
        {
            id: 'folder2',
            name: 'Folder 2',
            price: '₹7.99',
            image: 'images/folder2.jpg'
        }
    ],
    'sewing-machine': [
        {
            id: 'sew1',
            name: 'Sewing Machine Pro',
            price: '₹299.99',
            image: 'images/sewing-machine.jpg'
        },
        {
            id: 'sew2',
            name: 'Sewing Machine Basic',
            price: '₹199.99',
            image: 'images/sewing-machine2.jpg'
        }
    ],
    'needles': [
        {
            id: 'needle1',
            name: 'Professional Needle Set',
            price: '₹19.99',
            image: 'images/needles.jpg'
        },
        {
            id: 'needle2',
            name: 'Basic Needle Set',
            price: '₹9.99',
            image: 'images/needles2.jpg'
        }
    ],
    'blades': [
        {
            id: 'blade1',
            name: 'Blade 1',
            price: '₹5.99',
            image: 'images/blade1.jpg'
        },
        {
            id: 'knife1',
            name: 'Knife 1',
            price: '₹7.99',
            image: 'images/knife1.jpg'
        }
    ],
    'iron': [
        {
            id: 'iron1',
            name: 'Steam Iron 1',
            price: '₹49.99',
            image: 'images/steam-iron1.jpg'
        },
        {
            id: 'iron2',
            name: 'Steam Iron 2',
            price: '₹59.99',
            image: 'images/steam-iron2.jpg'
        }
    ],
    'motor': [
        {
            id: 'motor1',
            name: 'Motor 1',
            price: '₹89.99',
            image: 'images/motor1.jpg'
        },
        {
            id: 'motor2',
            name: 'Motor 2',
            price: '₹99.99',
            image: 'images/motor2.jpg'
        }
    ],
    'embroidery': [
        {
            id: 'emb1',
            name: 'Embroidery 1',
            price: '₹79.99',
            image: 'images/embroidery1.jpg'
        },
        {
            id: 'emb2',
            name: 'Embroidery 2',
            price: '₹89.99',
            image: 'images/embroidery2.jpg'
        }
    ],
    'loopers': [
        {
            id: 'loop1',
            name: 'Looper 1',
            price: '₹29.99',
            image: 'images/looper1.jpg'
        },
        {
            id: 'loop2',
            name: 'Looper 2',
            price: '₹39.99',
            image: 'images/looper2.jpg'
        }
    ],
    'board': [
        {
            id: 'board1',
            name: 'Board 1',
            price: '₹49.99',
            image: 'images/board1.jpg'
        },
        {
            id: 'board2',
            name: 'Board 2',
            price: '₹59.99',
            image: 'images/board2.jpg'
        }
    ],
    'accessories': [
        {
            id: 'acc1',
            name: 'Accessory 1',
            price: '₹19.99',
            image: 'images/accessory1.jpg'
        },
        {
            id: 'acc2',
            name: 'Accessory 2',
            price: '₹24.99',
            image: 'images/accessory2.jpg'
        }
    ]
};

// Function to render products in a section
function renderProducts(categoryId, container) {
    const categoryProducts = products[categoryId];
    if (!categoryProducts) return;

    container.innerHTML = '';
    categoryProducts.forEach(product => {
        const productCard = document.createElement('div');
        productCard.className = 'product-card';
        productCard.innerHTML = `
            <img src="${product.image}" alt="${product.name}" class="product-image">
            <h3 class="product-name">${product.name}</h3>
            <p class="product-price">${product.price}</p>
        `;
        container.appendChild(productCard);
    });
}

// Function to add a new product to a category
function addProduct(categoryId, product) {
    if (!products[categoryId]) {
        products[categoryId] = [];
    }
    products[categoryId].push(product);
    // Update both home page and categories page if they're open
    updateProductDisplays(categoryId);
}

// Function to update product displays on both pages
function updateProductDisplays(categoryId) {
    // Update home page
    const homeContainer = document.querySelector(`.${categoryId} .product-grid-horizontal`);
    if (homeContainer) {
        renderProducts(categoryId, homeContainer);
    }

    // Update categories page
    const categoriesContainer = document.querySelector(`#${categoryId} .product-grid`);
    if (categoriesContainer) {
        renderProducts(categoryId, categoriesContainer);
    }
}

// Initialize product displays when the page loads
document.addEventListener('DOMContentLoaded', function() {
    // Update all sections on the home page
    Object.keys(products).forEach(categoryId => {
        const container = document.querySelector(`.${categoryId} .product-grid-horizontal`);
        if (container) {
            renderProducts(categoryId, container);
        }
    });

    // Update all sections on the categories page
    if (window.location.pathname.includes('categories.html')) {
        Object.keys(products).forEach(categoryId => {
            const container = document.querySelector(`#${categoryId} .product-grid`);
            if (container) {
                renderProducts(categoryId, container);
            }
        });
    }
});

// DOM Elements
const productsGrid = document.querySelector('.products-grid');
const categoryFilter = document.getElementById('categoryFilter');
const sortFilter = document.getElementById('sortFilter');

// Initialize the page
document.addEventListener('DOMContentLoaded', function() {
    // Load products from localStorage
    const products = JSON.parse(localStorage.getItem('products') || '[]');
    const productsGrid = document.querySelector('.products-grid');

    // Display products
    function displayProducts() {
        productsGrid.innerHTML = products.map(product => `
            <div class="product-card" data-id="${product.id}" data-price="${product.price}">
                <img src="${product.images[0] || 'images/placeholder.jpg'}" alt="${product.name}" class="product-image">
                <h3 class="product-name">${product.name}</h3>
                <p class="product-price">₹${product.price.toFixed(2)}</p>
                <button class="add-to-cart">Add to Cart</button>
            </div>
        `).join('');

        // Add event listeners to "Add to Cart" buttons
        addCartEventListeners();
    }

    // Add event listeners to "Add to Cart" buttons
    function addCartEventListeners() {
        document.querySelectorAll('.add-to-cart').forEach(button => {
            button.addEventListener('click', (e) => {
                const productCard = e.target.closest('.product-card');
                const productId = productCard.dataset.id;
                const product = products.find(p => p.id === productId);
                
                if (product) {
                    // Add to cart using shared cart functionality
                    const sharedCart = new SharedCart();
                    sharedCart.addToCart(product);
                    alert('Product added to cart!');
                }
            });
        });
    }

    // Initialize products display
    displayProducts();
});

// Display products in the grid
function displayProducts(productsToShow) {
    productsGrid.innerHTML = '';
    
    productsToShow.forEach(product => {
        const productCard = createProductCard(product);
        productsGrid.appendChild(productCard);
    });
}

// Create a product card element
function createProductCard(product) {
    const card = document.createElement('div');
    card.className = 'product-card';
    
    const ratingStars = Array(5).fill().map((_, i) => {
        if (i < Math.floor(product.rating)) {
            return '<i class="fas fa-star"></i>';
        } else if (i === Math.floor(product.rating) && product.rating % 1 !== 0) {
            return '<i class="fas fa-star-half-alt"></i>';
        } else {
            return '<i class="far fa-star"></i>';
        }
    }).join('');

    card.innerHTML = `
        <div class="product-image">
            <img src="${product.image}" alt="${product.name}">
            <div class="product-overlay">
                <button class="quick-view-btn">Quick View</button>
            </div>
        </div>
        <div class="product-info">
            <h3>${product.name}</h3>
            <p class="product-price">₹${product.price.toFixed(2)}</p>
            <div class="product-rating">
                ${ratingStars}
                <span>(${product.reviews})</span>
            </div>
            <button class="add-to-cart-btn" data-id="${product.id}">Add to Cart</button>
        </div>
    `;

    return card;
}

// Setup event listeners
function setupEventListeners() {
    // Category filter
    categoryFilter.addEventListener('change', () => {
        const selectedCategory = categoryFilter.value;
        const filteredProducts = selectedCategory 
            ? products.filter(product => product.category === selectedCategory)
            : products;
        displayProducts(filteredProducts);
    });

    // Sort filter
    sortFilter.addEventListener('change', () => {
        const sortValue = sortFilter.value;
        let sortedProducts = [...products];
        
        switch(sortValue) {
            case 'price-asc':
                sortedProducts.sort((a, b) => a.price - b.price);
                break;
            case 'price-desc':
                sortedProducts.sort((a, b) => b.price - a.price);
                break;
            case 'name-asc':
                sortedProducts.sort((a, b) => a.name.localeCompare(b.name));
                break;
            case 'name-desc':
                sortedProducts.sort((a, b) => b.name.localeCompare(a.name));
                break;
        }
        
        displayProducts(sortedProducts);
    });

    // Add to cart buttons
    productsGrid.addEventListener('click', (e) => {
        if (e.target.classList.contains('add-to-cart-btn')) {
            const productId = parseInt(e.target.dataset.id);
            addToCart(productId);
        }
    });
}

// Add product to cart
function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    if (product) {
        // Update cart count
        const cartCount = document.querySelector('.cart-count');
        cartCount.textContent = parseInt(cartCount.textContent) + 1;
        
        // Show notification
        showNotification(`${product.name} added to cart!`);
    }
}

// Show notification
function showNotification(message) {
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.remove();
    }, 3000);
} 