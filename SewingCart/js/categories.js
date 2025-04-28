document.addEventListener('DOMContentLoaded', function() {
    const searchInput = document.getElementById('searchInput');
    const searchResults = document.getElementById('searchResults');
    const categoryCards = document.querySelectorAll('.category-card');

    // Load products for each category
    function loadCategoryProducts() {
        const categories = getAllCategories();
        const products = getAllProducts();

        categoryCards.forEach(card => {
            const categoryId = parseInt(card.getAttribute('data-category-id'));
            const categoryProducts = products.filter(p => p.categoryId === categoryId);
            
            // Add product count to category card
            const productCount = document.createElement('div');
            productCount.className = 'product-count';
            productCount.textContent = `${categoryProducts.length} products`;
            card.querySelector('.category-info').appendChild(productCount);
        });
    }

    function searchCategories() {
        const searchTerm = searchInput.value.toLowerCase();
        let hasResults = false;

        categoryCards.forEach(card => {
            const title = card.querySelector('.category-title').textContent.toLowerCase();
            const description = card.querySelector('.category-description').textContent.toLowerCase();
            
            if (title.includes(searchTerm) || description.includes(searchTerm)) {
                card.style.display = 'block';
                hasResults = true;
            } else {
                card.style.display = 'none';
            }
        });

        // Show/hide no results message
        if (!hasResults && searchTerm.length > 0) {
            searchResults.innerHTML = '<p class="no-results">No categories found matching your search.</p>';
            searchResults.style.display = 'block';
        } else {
            searchResults.style.display = 'none';
        }
    }

    // Search as you type
    searchInput.addEventListener('input', searchCategories);

    // Clear search when clicking the search button
    document.getElementById('searchButton').addEventListener('click', function() {
        if (searchInput.value.trim() === '') {
            categoryCards.forEach(card => {
                card.style.display = 'block';
            });
            searchResults.style.display = 'none';
        }
    });

    // Initialize
    loadCategoryProducts();
}); 