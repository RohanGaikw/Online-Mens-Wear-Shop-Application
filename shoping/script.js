function addToCart(productId) {
    const userId = 1; // Replace this with the actual user ID you want to use
    const productName = document.querySelector(`[onclick="addToCart(${productId})"]`).parentElement.querySelector('[data-product-name]').innerText;
    
    // Ensure that you parse the product price to a float
    const productPriceText = document.querySelector(`[onclick="addToCart(${productId})"]`).parentElement.querySelector('[data-product-price]').innerText;
    const productPrice = parseFloat(productPriceText.replace(/[^0-9.-]+/g, '')); // Remove any currency symbols and convert to float

    fetch('/add-to-cart', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            product_id: productId,
            quantity: 1, // You can adjust this for different quantities
            user_id: userId,
            product_name: productName,
            product_price: productPrice, // Ensure this is a number
        })
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            alert('Product added to cart!');
        } else {
            alert('Error adding product to cart: ' + data.message);
        }
    })
    .catch(error => {
        console.error('Error:', error);
        alert('An error occurred while adding the product to the cart.');
    });
}










// function addToCart(productId) {
//     // Assume you have a way to get the current user's ID, e.g., from a global variable
//     const userId = 1; // Replace this with the actual user ID you want to use
//     const productName = document.querySelector(`[onclick="addToCart(${productId})"]`).parentElement.querySelector('[data-product-name]').innerText;
//     const productPrice = document.querySelector(`[onclick="addToCart(${productId})"]`).parentElement.querySelector('[data-product-price]').innerText;
//     fetch('/add-to-cart', {
//         method: 'POST',
//         headers: {
//             'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({
//             product_id: productId,
//             quantity: 1, // You can adjust this for different quantities
//             user_id: userId,
//             product_name: productName,
//             product_price: productPrice,

//              // Send user ID
//         })
//     })
//     .then(response => response.json())
//     .then(data => {
//         if (data.success) {
//             alert('Product added to cart!');
//         } else {
//             alert('Error adding product to cart: ' + data.message);
//         }
//     })
//     .catch(error => {
//         console.error('Error:', error);
//         alert('An error occurred while adding the product to the cart.');
//     });
// }

// function ordersucessfully(productId) {
//     // This function would handle the buy now process.
//     alert('Order placed successfully for product ID: ' + productId);
// }





// // function addToCart(productId) {
// //     // Retrieve the product details from the data attributes
// //     const productName = document.querySelector(`[data-product-id="${productId}"]`).nextElementSibling.innerText;
// //     const price = parseFloat(document.querySelector(`[data-product-id="${productId}"]`).nextElementSibling.nextElementSibling.getAttribute('data-product-price'));

// //     // For demonstration purposes, we'll use a hardcoded user ID (e.g., 1)
// //     const userId = 1;
// //     const quantity = 1; // Default quantity for adding to cart

// //     // Call the function to add the product to the cart
// //     addToCartRequest(userId, productId, productName, price, quantity);
// // }

// // function addToCartRequest(userId, productId, productName, price, quantity) {
// //     fetch('/add-to-cart', {
// //         method: 'POST',
// //         headers: {
// //             'Content-Type': 'application/json'
// //         },
// //         body: JSON.stringify({
// //             userId: userId,
// //             productId: productId,
// //             productName: productName,
// //             price: price,
// //             quantity: quantity
// //         })
// //     })
// //     .then(response => response.json())
// //     .then(data => {
// //         if (data.success) {
// //             alert('Product added to cart successfully');
// //         } else {
// //             alert('Error: ' + data.message);
// //         }
// //     })
// //     .catch(error => {
// //         console.error('Error:', error);
// //     });
// // }

// // function ordersucessfully(productId) {
// //     // This function would handle the buy now process.
// //     alert('Order placed successfully for product ID: ' + productId);
// // }
