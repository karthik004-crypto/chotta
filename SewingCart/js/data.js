// Product data structure
const productData = {
    products: [],
    categories: [
        { id: 1, name: 'Fabrics', description: 'Explore our wide range of high-quality fabrics for all your sewing projects.', image: 'images/fabrics.jpg' },
        { id: 2, name: 'Threads', description: 'Premium quality threads in various colors and materials.', image: 'images/threads.jpg' },
        { id: 3, name: 'Notions', description: 'Essential sewing tools and accessories for every project.', image: 'images/notions.jpg' },
        { id: 4, name: 'Patterns', description: 'Professional sewing patterns for garments and accessories.', image: 'images/patterns.jpg' },
        { id: 5, name: 'Machines', description: 'Sewing machines and accessories for all skill levels.', image: 'images/machines.jpg' },
        { id: 6, name: 'Embroidery', description: 'Embroidery supplies and materials for decorative stitching.', image: 'images/embroidery.jpg' }
    ]
};

// Save data to localStorage
function saveData() {
    localStorage.setItem('sewingCartProducts', JSON.stringify(productData.products));
    localStorage.setItem('sewingCartCategories', JSON.stringify(productData.categories));
}

// Load data from localStorage
function loadData() {
    const savedProducts = localStorage.getItem('sewingCartProducts');
    const savedCategories = localStorage.getItem('sewingCartCategories');
    
    if (savedProducts) {
        productData.products = JSON.parse(savedProducts);
    }
    if (savedCategories) {
        productData.categories = JSON.parse(savedCategories);
    }
}

// Add a new product
function addProduct(product) {
    product.id = Date.now(); // Generate unique ID
    productData.products.push(product);
    saveData();
    return product;
}

// Update an existing product
function updateProduct(productId, updatedProduct) {
    const index = productData.products.findIndex(p => p.id === productId);
    if (index !== -1) {
        productData.products[index] = { ...productData.products[index], ...updatedProduct };
        saveData();
        return true;
    }
    return false;
}

// Delete a product
function removeProduct(productId) {
    const index = productData.products.findIndex(p => p.id === productId);
    if (index !== -1) {
        productData.products.splice(index, 1);
        saveData();
        return true;
    }
    return false;
}

// Get all products
function getAllProducts() {
    return productData.products;
}

// Get a product by ID
function getProductById(productId) {
    return productData.products.find(p => p.id === productId);
}

// Get products by category
function getProductsByCategory(categoryId) {
    return productData.products.filter(product => product.categoryId === categoryId);
}

// Add a new category
function addCategory(category) {
    category.id = Date.now(); // Generate unique ID
    productData.categories.push(category);
    saveData();
    return category;
}

// Update an existing category
function updateCategory(categoryId, updatedCategory) {
    const index = productData.categories.findIndex(c => c.id === categoryId);
    if (index !== -1) {
        productData.categories[index] = { ...productData.categories[index], ...updatedCategory };
        saveData();
        return true;
    }
    return false;
}

// Delete a category
function removeCategory(categoryId) {
    const index = productData.categories.findIndex(c => c.id === categoryId);
    if (index !== -1) {
        // Remove all products in this category
        productData.products = productData.products.filter(p => p.categoryId !== categoryId);
        productData.categories.splice(index, 1);
        saveData();
        return true;
    }
    return false;
}

// Get all categories
function getAllCategories() {
    return productData.categories;
}

// Get a category by ID
function getCategoryById(categoryId) {
    return productData.categories.find(c => c.id === categoryId);
}

// Initialize data
loadData(); 