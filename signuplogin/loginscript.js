document.getElementById('loginForm').addEventListener('submit', function(event) {
    event.preventDefault(); // Prevent the default form submission

    // Retrieve username and password from form inputs
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    // Check if username and password are provided
    if (!username || !password) {
        alert('Please enter both username and password.');
        return; // Exit the function if validation fails
    }

    // Example login success logic
    fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }) // Send entered data
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            // Store username in sessionStorage (or localStorage)
            sessionStorage.setItem('username', data.username); 
            console.log('Username stored in sessionStorage:', sessionStorage.getItem('username')); // Debug log

            alert('Login successful!');
            window.location.href = 'shop.html'; // Redirect to the shop page
        } else {
            alert('Login failed: ' + data.message);
        }
    })
    .catch(error => {
        console.error('Error during login:', error);
        alert('An error occurred during login.');
    });
});
