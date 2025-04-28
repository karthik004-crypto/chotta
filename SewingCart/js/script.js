// Mobile Menu Toggle
const mobileMenu = document.querySelector('.mobile-menu');
const navLinks = document.querySelector('.nav-links');

mobileMenu.addEventListener('click', () => {
    navLinks.classList.toggle('active');
});

// Sample Products Data
const products = [
    {
        id: 1,
        name: "Professional Sewing Machine",
        price: 299.99,
        image: "https://images.unsplash.com/photo-1508873535684-277a3cbcc4e8?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
        description: "High-quality sewing machine for professional use"
    },
    {
        id: 2,
        name: "Premium Thread Set",
        price: 24.99,
        image: "https://images.unsplash.com/photo-1584992236310-6edddc08acff?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
        description: "Set of 30 premium threads in various colors"
    },
    {
        id: 3,
        name: "Fabric Scissors",
        price: 19.99,
        image: "https://images.unsplash.com/photo-1584992236310-6edddc08acff?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
        description: "Professional grade fabric scissors"
    }
];

// Display Products
const productGrid = document.querySelector('.product-grid');

function displayProducts() {
    products.forEach(product => {
        const productCard = document.createElement('div');
        productCard.classList.add('product-card');
        productCard.innerHTML = `
            <img src="${product.image}" alt="${product.name}">
            <h3>${product.name}</h3>
            <p>${product.description}</p>
            <p class="price">₹${product.price}</p>
            <button onclick="addToCart(${product.id})" class="add-to-cart">Add to Cart</button>
        `;
        productGrid.appendChild(productCard);
    });
}

// Initialize cart
let cart = [];
let cartCount = 0;

// Add to Cart functionality
function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    if (product) {
        cart.push(product);
        updateCartCount();
        showNotification('Product added to cart!');
    }
}

// Update Cart Count
function updateCartCount() {
    const cartCountElement = document.querySelector('.cart-count');
    cartCount = cart.length;
    cartCountElement.textContent = cartCount;
}

// Show Notification
function showNotification(message) {
    const notification = document.createElement('div');
    notification.classList.add('notification');
    notification.textContent = message;
    document.body.appendChild(notification);

    setTimeout(() => {
        notification.remove();
    }, 3000);
}

// Contact Form Submission
const contactForm = document.getElementById('contactForm');

contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const formData = new FormData(contactForm);
    // Here you would typically send the form data to a server
    showNotification('Message sent successfully!');
    contactForm.reset();
});

// Initialize the page
document.addEventListener('DOMContentLoaded', () => {
    displayProducts();
});

// Smooth Scroll for Navigation Links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        document.querySelector(this.getAttribute('href')).scrollIntoView({
            behavior: 'smooth'
        });
    });
});

// Search Functionality
const searchInput = document.getElementById('searchInput');
const searchButton = document.getElementById('searchButton');
const searchResults = document.getElementById('searchResults');
const searchContainer = document.querySelector('.search-container');

function searchProducts(query) {
    const results = products.filter(product => 
        product.name.toLowerCase().includes(query.toLowerCase()) ||
        product.description.toLowerCase().includes(query.toLowerCase())
    );

    displaySearchResults(results);
}

function displaySearchResults(results) {
    searchResults.innerHTML = '';
    
    if (results.length === 0) {
        searchResults.innerHTML = '<div class="search-result-item">No products found</div>';
    } else {
        results.forEach(product => {
            const resultItem = document.createElement('div');
            resultItem.classList.add('search-result-item');
            resultItem.innerHTML = `
                <h3>${product.name}</h3>
                <p>${product.description}</p>
            `;
            resultItem.addEventListener('click', () => {
                document.querySelector('#products').scrollIntoView({ behavior: 'smooth' });
                searchResults.classList.remove('active');
                searchInput.value = '';
            });
            searchResults.appendChild(resultItem);
        });
    }
}

// Event Listeners for Search
searchInput.addEventListener('input', (e) => {
    const query = e.target.value.trim();
    if (query.length > 0) {
        searchProducts(query);
        searchResults.classList.add('active');
    } else {
        searchResults.classList.remove('active');
    }
});

searchButton.addEventListener('click', () => {
    const query = searchInput.value.trim();
    if (query.length > 0) {
        searchProducts(query);
        searchResults.classList.add('active');
    }
});

// Close search results when clicking outside
document.addEventListener('click', (e) => {
    if (!searchContainer.contains(e.target)) {
        searchResults.classList.remove('active');
    }
}); 