// Cart functionality
document.addEventListener('DOMContentLoaded', () => {
    const cartItems = document.querySelector('.cart-items');
    const emptyCart = document.querySelector('.empty-cart');
    const cartContent = document.querySelector('.cart-content');
    const quantityInputs = document.querySelectorAll('.quantity-input');
    const removeButtons = document.querySelectorAll('.remove-btn');
    const checkoutButton = document.querySelector('.checkout-btn');

    // Update cart display based on items
    function updateCartDisplay() {
        const items = sharedCart.getCartItems();
        if (items.length === 0) {
            cartContent.style.display = 'none';
            emptyCart.style.display = 'block';
        } else {
            cartContent.style.display = 'grid';
            emptyCart.style.display = 'none';
            renderCartItems();
        }
    }

    // Render cart items
    function renderCartItems() {
        const items = sharedCart.getCartItems();
        const cartItemsContainer = document.querySelector('.cart-items');
        
        // Clear existing items
        const existingItems = cartItemsContainer.querySelectorAll('.cart-item');
        existingItems.forEach(item => item.remove());

        // Add header
        const header = document.createElement('div');
        header.className = 'cart-header';
        header.innerHTML = `
            <div class="header-item">Product</div>
            <div class="header-item">Price</div>
            <div class="header-item">Qty</div>
            <div class="header-item">Total</div>
            <div class="header-item"></div>
        `;
        cartItemsContainer.appendChild(header);

        // Add items
        items.forEach(item => {
            const cartItem = document.createElement('div');
            cartItem.className = 'cart-item';
            cartItem.innerHTML = `
                <div class="item-details">
                    <img src="${item.image}" alt="${item.name}">
                    <div class="item-info">
                        <h3>${item.name}</h3>
                    </div>
                </div>
                <div class="item-price">$${item.price.toFixed(2)}</div>
                <div class="item-quantity">
                    <button class="quantity-btn minus">-</button>
                    <input type="number" value="${item.quantity}" min="1" class="quantity-input">
                    <button class="quantity-btn plus">+</button>
                </div>
                <div class="item-total">$${(item.price * item.quantity).toFixed(2)}</div>
                <div class="item-actions">
                    <button class="remove-btn" data-id="${item.id}"><i class="fas fa-trash"></i></button>
                </div>
            `;
            cartItemsContainer.appendChild(cartItem);
        });

        // Add event listeners to new elements
        addCartEventListeners();
        updateCartTotal();
    }

    // Add event listeners to cart items
    function addCartEventListeners() {
        // Quantity buttons
        document.querySelectorAll('.quantity-btn').forEach(button => {
            button.addEventListener('click', () => {
                const input = button.parentElement.querySelector('.quantity-input');
                const currentValue = parseInt(input.value);
                
                if (button.classList.contains('minus') && currentValue > 1) {
                    input.value = currentValue - 1;
                } else if (button.classList.contains('plus')) {
                    input.value = currentValue + 1;
                }
                
                const itemId = button.closest('.cart-item').querySelector('.remove-btn').dataset.id;
                sharedCart.updateQuantity(itemId, parseInt(input.value));
                updateCartTotal();
            });
        });

        // Quantity inputs
        document.querySelectorAll('.quantity-input').forEach(input => {
            input.addEventListener('change', () => {
                if (input.value < 1) input.value = 1;
                const itemId = input.closest('.cart-item').querySelector('.remove-btn').dataset.id;
                sharedCart.updateQuantity(itemId, parseInt(input.value));
                updateCartTotal();
            });
        });

        // Remove buttons
        document.querySelectorAll('.remove-btn').forEach(button => {
            button.addEventListener('click', () => {
                const itemId = button.dataset.id;
                sharedCart.removeFromCart(itemId);
                updateCartDisplay();
            });
        });
    }

    // Update cart total
    function updateCartTotal() {
        const items = sharedCart.getCartItems();
        let subtotal = 0;

        items.forEach(item => {
            subtotal += item.price * item.quantity;
        });

        const shipping = 10.00;
        const tax = (subtotal * 0.1).toFixed(2);
        const total = (subtotal + shipping + parseFloat(tax)).toFixed(2);

        document.querySelector('.summary-item:nth-child(1) span:last-child').textContent = `$${subtotal.toFixed(2)}`;
        document.querySelector('.summary-item:nth-child(2) span:last-child').textContent = `$${shipping.toFixed(2)}`;
        document.querySelector('.summary-item:nth-child(3) span:last-child').textContent = `$${tax}`;
        document.querySelector('.summary-item.total span:last-child').textContent = `$${total}`;
    }

    // Initialize cart
    updateCartDisplay();
});

// Payment Modal Functionality
const paymentModal = document.getElementById('paymentModal');
const checkoutBtn = document.querySelector('.checkout-btn');
const closeModal = document.querySelector('.close-modal');
const selectPaymentBtns = document.querySelectorAll('.select-payment');

// Show payment modal when clicking checkout button
checkoutBtn.addEventListener('click', () => {
    // Check if user is logged in
    const isLoggedIn = checkUserLoginStatus();
    
    if (!isLoggedIn) {
        // Show login prompt
        if (confirm('Please login to proceed with payment. Would you like to login now?')) {
            // Redirect to login page with return URL
            const currentUrl = window.location.href;
            window.location.href = `login.html?returnUrl=${encodeURIComponent(currentUrl)}`;
        }
        return;
    }

    // If logged in, show payment modal
    paymentModal.classList.add('active');
    document.body.style.overflow = 'hidden';
});

// Check if user is logged in
function checkUserLoginStatus() {
    // Check for auth token in localStorage
    const token = localStorage.getItem('authToken');
    return !!token; // Returns true if token exists, false otherwise
}

// Close modal when clicking close button or outside the modal
closeModal.addEventListener('click', closePaymentModal);
paymentModal.addEventListener('click', (e) => {
    if (e.target === paymentModal) {
        closePaymentModal();
    }
});

// Handle payment method selection
selectPaymentBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        const paymentMethod = btn.dataset.method;
        handlePayment(paymentMethod);
    });
});

function closePaymentModal() {
    paymentModal.classList.remove('active');
    document.body.style.overflow = '';
}

function handlePayment(method) {
    const totalAmount = document.querySelector('.summary-item.total span:last-child').textContent;
    const amount = totalAmount.replace('$', '').trim();
    const upiId = 'karthik0402@ybl';
    
    let paymentUrl;
    
    switch(method) {
        case 'phonepe':
            paymentUrl = `upi://pay?pa=${upiId}&pn=SewingCart&am=${amount}&cu=INR&tn=SewingCart Payment`;
            break;
        case 'gpay':
            paymentUrl = `upi://pay?pa=${upiId}&pn=SewingCart&am=${amount}&cu=INR&tn=SewingCart Payment`;
            break;
        default:
            console.error('Invalid payment method');
            return;
    }

    // Create a temporary link and click it to open the payment app
    const link = document.createElement('a');
    link.href = paymentUrl;
    link.style.display = 'none';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    // Show a message to the user
    const message = `Opening ${method === 'phonepe' ? 'PhonePe' : 'Google Pay'} with amount ${totalAmount}. Please complete the payment in the app.`;
    alert(message);
    
    // Redirect to success page after a short delay
    setTimeout(() => {
        const orderNumber = '#' + Math.floor(100000 + Math.random() * 900000);
        const successUrl = `payment-success.html?order=${orderNumber}&method=${method === 'phonepe' ? 'PhonePe' : 'Google Pay'}&amount=${totalAmount}`;
        window.location.href = successUrl;
    }, 2000);
    
    closePaymentModal();
}

// Close modal when pressing Escape key
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && paymentModal.classList.contains('active')) {
        closePaymentModal();
    }
}); 