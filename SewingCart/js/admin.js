// Navigation functionality
document.addEventListener('DOMContentLoaded', function() {
    // Initialize all required elements
    const addProductBtn = document.getElementById('addProductBtn');
    const productFormContainer = document.getElementById('productFormContainer');
    const productForm = document.getElementById('productForm');
    const cancelProductBtn = document.getElementById('cancelProductBtn');
    const addCategoryBtn = document.getElementById('addCategoryBtn');
    const categoryFormContainer = document.getElementById('categoryFormContainer');
    const categoryForm = document.getElementById('categoryForm');
    const cancelCategoryBtn = document.getElementById('cancelCategoryBtn');
    const navLinks = document.querySelectorAll('.sidebar-nav a');
    const sections = document.querySelectorAll('.admin-section');

    // Load initial data
    loadData();
    loadCategories();
    loadProducts();
    updateDashboardStats();

    // Function to hide all forms
    function hideAllForms() {
        if (productFormContainer) productFormContainer.style.display = 'none';
        if (categoryFormContainer) categoryFormContainer.style.display = 'none';
    }

    // Function to show a specific section
    function showSection(sectionId) {
        sections.forEach(section => {
            section.classList.remove('active');
            if (section.id === sectionId) {
                section.classList.add('active');
                // Load relevant data when switching sections
                if (sectionId === 'products') {
                    loadCategories();
                    loadProducts();
                } else if (sectionId === 'categories') {
                    loadCategories();
                }
            }
        });
    }

    // Navigation handling
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href').substring(1);
            
            // Update active state
            navLinks.forEach(l => l.classList.remove('active'));
            this.classList.add('active');
            
            // Show the target section
            showSection(targetId);
            
            // Hide all forms when navigating
            hideAllForms();
        });
    });

    // Product form handling
    if (addProductBtn && productFormContainer) {
        addProductBtn.addEventListener('click', function(e) {
            e.preventDefault();
            hideAllForms();
            productFormContainer.style.display = 'block';
            document.getElementById('productId').value = '';
            productForm.reset();
            loadCategories();
        });
    }

    if (cancelProductBtn && productFormContainer) {
        cancelProductBtn.addEventListener('click', function(e) {
            e.preventDefault();
            productFormContainer.style.display = 'none';
            productForm.reset();
        });
    }

    // Category form handling
    if (addCategoryBtn && categoryFormContainer) {
        addCategoryBtn.addEventListener('click', function(e) {
            e.preventDefault();
            hideAllForms();
            categoryFormContainer.style.display = 'block';
            document.getElementById('categoryId').value = '';
            categoryForm.reset();
        });
    }

    if (cancelCategoryBtn && categoryFormContainer) {
        cancelCategoryBtn.addEventListener('click', function(e) {
            e.preventDefault();
            categoryFormContainer.style.display = 'none';
            categoryForm.reset();
        });
    }

    // Form submission handling
    if (productForm) {
        productForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const productId = document.getElementById('productId').value;
            const productData = {
                name: document.getElementById('productName').value,
                categoryId: parseInt(document.getElementById('categorySelect').value),
                price: parseFloat(document.getElementById('productPrice').value),
                description: document.getElementById('productDescription').value,
                stock: parseInt(document.getElementById('productStock').value),
                image: document.getElementById('productImage').value
            };

            try {
                if (productId) {
                    const success = updateProduct(parseInt(productId), productData);
                    if (!success) throw new Error('Failed to update product');
                } else {
                    addProduct(productData);
                }
                productFormContainer.style.display = 'none';
                productForm.reset();
                loadProducts();
                updateDashboardStats();
                alert('Product saved successfully!');
            } catch (error) {
                console.error('Error saving product:', error);
                alert('Error saving product. Please try again.');
            }
        });
    }

    if (categoryForm) {
        categoryForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const categoryId = document.getElementById('categoryId').value;
            const categoryData = {
                name: document.getElementById('categoryName').value,
                description: document.getElementById('categoryDescription').value,
                image: document.getElementById('categoryImage').value
            };

            try {
                if (categoryId) {
                    const success = updateCategory(parseInt(categoryId), categoryData);
                    if (!success) throw new Error('Failed to update category');
                } else {
                    addCategory(categoryData);
                }
                categoryFormContainer.style.display = 'none';
                categoryForm.reset();
                loadCategories();
                updateMainCategories();
                updateDashboardStats();
                alert('Category saved successfully!');
            } catch (error) {
                console.error('Error saving category:', error);
                alert('Error saving category. Please try again.');
            }
        });
    }

    // Show dashboard by default
    showSection('dashboard');
});

// Update dashboard statistics
function updateDashboardStats() {
    const products = getAllProducts();
    const categories = getAllCategories();
    
    document.getElementById('totalProducts').textContent = products.length;
    document.getElementById('totalCategories').textContent = categories.length;
    
    // Calculate total revenue
    const totalRevenue = products.reduce((sum, product) => sum + (product.price * product.stock), 0);
    document.getElementById('totalRevenue').textContent = `₹${totalRevenue.toFixed(2)}`;
}

// Load categories into select dropdown
function loadCategories() {
    const categorySelect = document.getElementById('categorySelect');
    if (!categorySelect) return;

    const categories = getAllCategories();
    categorySelect.innerHTML = '<option value="">Select Category</option>';
    
    categories.forEach(category => {
        const option = document.createElement('option');
        option.value = category.id;
        option.textContent = category.name;
        categorySelect.appendChild(option);
    });
}

// Load products into table
function loadProducts() {
    const productList = document.getElementById('productList');
    if (!productList) return;

    const products = getAllProducts();
    const categories = getAllCategories();
    
    productList.innerHTML = '';
    
    products.forEach(product => {
        const category = categories.find(c => c.id === product.categoryId);
        const row = document.createElement('tr');
        row.innerHTML = `
            <td><img src="${product.image}" alt="${product.name}" class="product-thumbnail"></td>
            <td>${product.name}</td>
            <td>${category ? category.name : 'Uncategorized'}</td>
            <td>${product.description}</td>
            <td>₹${product.price.toFixed(2)}</td>
            <td>${product.stock}</td>
            <td>
                <button onclick="editProduct('${product.id}')" class="btn-secondary">
                    <i class="fas fa-edit"></i> Edit
                </button>
                <button onclick="deleteProduct('${product.id}')" class="btn-secondary">
                    <i class="fas fa-trash"></i> Delete
                </button>
            </td>
        `;
        productList.appendChild(row);
    });
}

// Edit product
function editProduct(productId) {
    const product = getProductById(productId);
    if (!product) return;

    document.getElementById('productId').value = product.id;
    document.getElementById('productName').value = product.name;
    document.getElementById('categorySelect').value = product.categoryId;
    document.getElementById('productPrice').value = product.price;
    document.getElementById('productDescription').value = product.description;
    document.getElementById('productStock').value = product.stock;
    document.getElementById('productImage').value = product.image;

    document.getElementById('productFormContainer').style.display = 'block';
    loadCategories();
}

// Delete product
function deleteProduct(productId) {
    if (confirm('Are you sure you want to delete this product?')) {
        removeProduct(productId);
        loadProducts();
    }
}

// Load categories into table
function loadCategories() {
    const categoryList = document.getElementById('categoryList');
    if (!categoryList) return;

    const categories = getAllCategories();
    const products = getAllProducts();
    categoryList.innerHTML = '';
    
    categories.forEach(category => {
        const categoryProducts = products.filter(p => p.categoryId === category.id);
        const row = document.createElement('tr');
        row.innerHTML = `
            <td><img src="${category.image}" alt="${category.name}" class="category-thumbnail"></td>
            <td>${category.name}</td>
            <td>${category.description}</td>
            <td>${categoryProducts.length} products</td>
            <td>
                <button onclick="editCategory('${category.id}')" class="btn-secondary">
                    <i class="fas fa-edit"></i> Edit
                </button>
                <button onclick="deleteCategory('${category.id}')" class="btn-secondary">
                    <i class="fas fa-trash"></i> Delete
                </button>
            </td>
        `;
        categoryList.appendChild(row);
    });
}

// Edit category
function editCategory(categoryId) {
    const category = getCategoryById(parseInt(categoryId));
    if (!category) {
        alert('Category not found');
        return;
    }

    // Show the category form
    const categoryFormContainer = document.getElementById('categoryFormContainer');
    if (!categoryFormContainer) return;

    // Fill in the form with category data
    document.getElementById('categoryId').value = category.id;
    document.getElementById('categoryName').value = category.name;
    document.getElementById('categoryDescription').value = category.description;
    document.getElementById('categoryImage').value = category.image;

    // Show the form
    categoryFormContainer.style.display = 'block';
}

// Delete category
function deleteCategory(categoryId) {
    if (!confirm('Are you sure you want to delete this category? This will also delete all products in this category.')) {
        return;
    }

    try {
        const categoryProducts = getProductsByCategory(parseInt(categoryId));
        if (categoryProducts.length > 0) {
            if (!confirm(`This category contains ${categoryProducts.length} products. Are you sure you want to delete it?`)) {
                return;
            }
        }

        const success = removeCategory(parseInt(categoryId));
        if (success) {
            loadCategories();
            loadProducts();
            updateDashboardStats();
            updateMainCategories();
            alert('Category and its products deleted successfully!');
        } else {
            throw new Error('Failed to delete category');
        }
    } catch (error) {
        console.error('Error deleting category:', error);
        alert('Error deleting category. Please try again.');
    }
}

// Update main categories display
function updateMainCategories() {
    const mainCategoriesContainer = document.querySelector('.categories-grid');
    if (!mainCategoriesContainer) return;

    const categories = getAllCategories();
    const products = getAllProducts();
    mainCategoriesContainer.innerHTML = '';

    categories.forEach(category => {
        const categoryProducts = products.filter(p => p.categoryId === category.id);
        const categoryCard = document.createElement('div');
        categoryCard.className = 'category-card';
        categoryCard.innerHTML = `
            <img src="${category.image}" alt="${category.name}">
            <h3>${category.name}</h3>
            <p>${category.description}</p>
            <div class="category-stats">
                <span>${categoryProducts.length} products</span>
            </div>
        `;
        mainCategoriesContainer.appendChild(categoryCard);
    });
}

// Add product with category validation
function addProduct(product) {
    // Validate category exists
    const category = getCategoryById(product.categoryId);
    if (!category) {
        throw new Error('Invalid category selected');
    }

    product.id = Date.now();
    productData.products.push(product);
    saveData();
    return product;
}

// Update product with category validation
function updateProduct(productId, updatedProduct) {
    // Validate category exists
    const category = getCategoryById(updatedProduct.categoryId);
    if (!category) {
        throw new Error('Invalid category selected');
    }

    const index = productData.products.findIndex(p => p.id === productId);
    if (index !== -1) {
        productData.products[index] = { ...productData.products[index], ...updatedProduct };
        saveData();
        return true;
    }
    return false;
} 