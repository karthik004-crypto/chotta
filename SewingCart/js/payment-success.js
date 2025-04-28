document.addEventListener('DOMContentLoaded', () => {
    // Get URL parameters
    const urlParams = new URLSearchParams(window.location.search);
    const orderNumber = urlParams.get('order') || generateOrderNumber();
    const paymentMethod = urlParams.get('method') || 'PhonePe';
    const amount = urlParams.get('amount') || '$394.97';
    const date = new Date().toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });

    // Update order details
    document.getElementById('orderNumber').textContent = orderNumber;
    document.getElementById('paymentMethod').textContent = paymentMethod;
    document.getElementById('amountPaid').textContent = amount;
    document.getElementById('orderDate').textContent = date;

    // Clear cart after successful payment
    clearCart();
});

// Generate a random order number
function generateOrderNumber() {
    return '#' + Math.floor(100000 + Math.random() * 900000);
}

// Clear the cart
function clearCart() {
    localStorage.removeItem('cart');
    updateCartCount();
}

// Update cart count in header
function updateCartCount() {
    const cartCount = document.querySelector('.cart-count');
    cartCount.textContent = '0';
}

// Download receipt
function downloadReceipt() {
    const orderDetails = {
        orderNumber: document.getElementById('orderNumber').textContent,
        paymentMethod: document.getElementById('paymentMethod').textContent,
        amount: document.getElementById('amountPaid').textContent,
        date: document.getElementById('orderDate').textContent
    };

    // Create receipt content
    const receiptContent = `
        Sewing Cart - Payment Receipt
        ============================
        
        Order Number: ${orderDetails.orderNumber}
        Payment Method: ${orderDetails.paymentMethod}
        Amount Paid: ${orderDetails.amount}
        Date: ${orderDetails.date}
        
        Thank you for your purchase!
        ============================
    `;

    // Create blob and download
    const blob = new Blob([receiptContent], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `receipt-${orderDetails.orderNumber}.txt`;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
} 