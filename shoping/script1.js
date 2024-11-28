function ordersuccessfully(username, productId) {
    sessionStorage.setItem('username', username);
    console.log('Username stored in sessionStorage:', sessionStorage.getItem('username'));

    if (!username) {
        alert('You must be logged in to place an order.');
        return;
    }

    console.log(`Looking for product ID: ${productId}`);
    const selector = `#product-${productId}`;
    console.log("Selector being used:", selector);

    const productElement = document.querySelector(selector);
    console.log("Product Element:", productElement); // Logs null if not found

    if (!productElement) {
        console.error(`Product with ID ${productId} not found`);
        alert('Product not found.');
        return;
    }

    const productName = productElement.querySelector('h3[data-product-name]').innerText;
    const productPrice = productElement.querySelector('p[data-product-price]').innerText;

    // Get the user_id from sessionStorage
    const userId = sessionStorage.getItem('user_id');
    if (!userId) {
        console.error('User ID is not available.');
        alert('User ID is required to place an order.');
        return;
    }

    const orderData = {
        product_id: productId,
        quantity: 1,
        user_id: userId,  // Send user_id instead of username
        product_name: productName,
        product_price: productPrice
    };
    
    fetch('/api/order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderData)
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            alert('Order placed successfully!');
        } else {
            alert('Failed to place order: ' + data.message);
        }
    })
    .catch(error => {
        console.error('Error placing order:', error);
        alert('An error occurred while placing the order.');
    });
}
