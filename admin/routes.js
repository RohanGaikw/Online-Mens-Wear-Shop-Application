const db = require('../backend/db'); // Adjust path if necessary

module.exports = (req, res) => {
    // Function to handle responses with error
    const sendError = (statusCode, message) => {
        res.writeHead(statusCode, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: false, message }));
    };

    if (req.url === '/api/users' && req.method === 'GET') {
        // Get all users
        db.query('SELECT * FROM users', (err, results) => {
            if (err) {
                sendError(500, 'Database error');
                return;
            }
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify(results));
        });
    } else if (req.url.startsWith('/api/users/') && req.method === 'DELETE') {
        // Delete user
        const userId = req.url.split('/').pop();
        db.query('DELETE FROM users WHERE id = ?', [userId], (err, result) => {
            if (err) {
                sendError(500, 'Database error');
                return;
            }
            if (result.affectedRows === 0) {
                sendError(404, 'User not found');
                return;
            }
            res.writeHead(204);
            res.end();
        });
    } else if (req.url === '/api/cart' && req.method === 'GET') {
        // Get cart items (Assuming there is a cart table)
        db.query('SELECT * FROM cart', (err, results) => {
            if (err) {
                sendError(500, 'Database error');
                return;
            }
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify(results));
        });
    } else if (req.url.startsWith('/api/cart/') && req.method === 'DELETE') {
        // Remove item from cart
        const itemId = req.url.split('/').pop();
        db.query('DELETE FROM cart WHERE id = ?', [itemId], (err, result) => {
            if (err) {
                sendError(500, 'Database error');
                return;
            }
            if (result.affectedRows === 0) {
                sendError(404, 'Cart item not found');
                return;
            }
            res.writeHead(204);
            res.end();
        });
    } else if (req.url === '/api/orders' && req.method === 'GET') {
        // Get orders
        db.query('SELECT * FROM orders', (err, results) => {
            if (err) {
                sendError(500, 'Database error');
                return;
            }
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify(results));
        });
    } else if (req.url.startsWith('/api/orders/') && req.method === 'DELETE') {
        // Cancel order
        const orderId = req.url.split('/').pop();
        db.query('DELETE FROM orders WHERE id = ?', [orderId], (err, result) => {
            if (err) {
                sendError(500, 'Database error');
                return;
            }
            if (result.affectedRows === 0) {
                sendError(404, 'Order not found');
                return;
            }
            res.writeHead(204);
            res.end();
        });
    } else {
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end('404 Not Found');
    }
};
