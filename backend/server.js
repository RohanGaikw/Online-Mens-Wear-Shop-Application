const http = require('http');
const fs = require('fs');
const path = require('path');
const db = require('./db'); // Ensure this connects to your MySQL database
const adminRoutes = require('../admin/routes');
const { serveStaticFiles, handleAddToCart } = require('../shoping/serveStatic');

const adminUsername = 'Rohan';
const adminPassword = 'Rohan@123';

const server = http.createServer((req, res) => {
    console.log(`Request for: ${req.url}`);

    // Serve the homepage
    if (req.url === '/') {
        fs.readFile(path.join(__dirname, '../index.html'), (err, data) => {
            if (err) {
                res.writeHead(500, { 'Content-Type': 'text/plain' });
                res.end('Internal Server Error');
                return;
            }
            res.writeHead(200, { 'Content-Type': 'text/html' });
            res.end(data);
        });
        return;
    }

    // Serve the login page (GET)
    if (req.url === '/login' && req.method === 'GET') {
        fs.readFile(path.join(__dirname, '../signuplogin/login.html'), (err, data) => {
            if (err) {
                res.writeHead(500, { 'Content-Type': 'text/plain' });
                res.end('Internal Server Error');
            } else {
                res.writeHead(200, { 'Content-Type': 'text/html' });
                res.end(data);
            }
        });
        return;
    }

    // Handle login (POST)
    if (req.url === '/login' && req.method === 'POST') {
        let body = '';
        req.on('data', chunk => {
            body += chunk.toString();
        });
        req.on('end', () => {
            const params = new URLSearchParams(body);
            // const name = params.get('name');
            const username = params.get('username');
            const password = params.get('password');
            // const email = params.get('email');
            // const address = params.get('address');

            db.query('SELECT * FROM users WHERE username = ? AND password = ?', [username, password], (err, results) => {
                if (err) {
                    console.error('Database Error:', err);
                    res.writeHead(500, { 'Content-Type': 'text/plain' });
                    res.end('Internal Server Error');
                    return;
                }
                if (results.length > 0) {
                    res.writeHead(302, { 'Location': '/Wear' });
                    res.end();
                } else {
                    res.writeHead(401, { 'Content-Type': 'text/plain' });
                    res.end('Invalid Credentials');
                }
            });
        });
        return;
    }

    // Serve the signup page (GET)
    if (req.url === '/signup' && req.method === 'GET') {
        fs.readFile(path.join(__dirname, '../signuplogin/signup.html'), (err, data) => {
            if (err) {
                res.writeHead(500, { 'Content-Type': 'text/plain' });
                res.end('Internal Server Error');
            } else {
                res.writeHead(200, { 'Content-Type': 'text/html' });
                res.end(data);
            }
        });
        return;
    }

   // Handle signup (POST)
if (req.url === '/signup' && req.method === 'POST') {
    let body = '';
    req.on('data', chunk => {
        body += chunk.toString();
    });
    req.on('end', () => {
        const params = new URLSearchParams(body);
        const name = params.get('name');
        const username = params.get('username');
        const password = params.get('password');
        const email = params.get('email');
        const address = params.get('address');

        // Check for existing email or username
        db.query('SELECT * FROM users WHERE email = ? OR username = ?', [email, username], (err, results) => {
            if (err) {
                res.writeHead(500, { 'Content-Type': 'text/plain' });
                res.end('Error checking for existing users');
                return;
            }

            if (results.length > 0) {
                // Prepare specific error messages
                let message = '';
                if (results.some(user => user.email === email)) {
                    message += 'Email already exists. ';
                }
                if (results.some(user => user.username === username)) {
                    message += 'Username already exists.';
                }

                res.writeHead(400, { 'Content-Type': 'text/plain' });
                res.end(message.trim());
                return;
            }

            // Proceed with inserting the new user
            db.query('INSERT INTO users (name, username, password, email, address) VALUES (?, ?, ?, ?, ?)', [name, username, password, email, address], (err) => {
                if (err) {
                    res.writeHead(500, { 'Content-Type': 'text/plain' });
                    res.end('Error signing up');
                    return;
                }
                res.writeHead(302, { 'Location': '/login' });
                res.end();
            });
        });
    });
    return;
}



    // Serve the Wear page
    if (req.url === '/Wear') {
        fs.readFile(path.join(__dirname, '../Public/Wear.html'), (err, data) => {
            if (err) {
                res.writeHead(500, { 'Content-Type': 'text/plain' });
                res.end('Internal Server Error');
            } else {
                res.writeHead(200, { 'Content-Type': 'text/html' });
                res.end(data);
            }
        });
        return;
    }
    if (req.url === '/Wear.html' && req.method === 'GET') {
        fs.readFile(path.join(__dirname, '../Public/Wear.html'), (err, data) => {
            if (err) {
                res.writeHead(500, { 'Content-Type': 'text/plain' });
                res.end('Internal Server Error');
            } else {
                res.writeHead(200, { 'Content-Type': 'text/html' });
                res.end(data);
            }
        });
        return;
    }
    
    
    // Serve the about page
if (req.url === '/about.html' && req.method === 'GET') {
    fs.readFile(path.join(__dirname, '../about.html'), (err, data) => {
        if (err) {
            res.writeHead(500, { 'Content-Type': 'text/plain' });
            res.end('Internal Server Error');
        } else {
            res.writeHead(200, { 'Content-Type': 'text/html' });
            res.end(data);
        }
    });
    return;
}

    
   // Serve static files (CSS, JS, Images)
if (req.url.startsWith('/css/') || req.url.startsWith('/signuplogin/') || req.url.startsWith('/js/') || req.url.startsWith('/shoping/') || req.url.startsWith('/Homeimages/')) {
    const filePath = path.join(__dirname, '../', req.url);
    fs.readFile(filePath, (err, data) => {
        if (err) {
            res.writeHead(404, { 'Content-Type': 'text/plain' });
            // res.end('404 Not Found');
        } else {
            const ext = path.extname(req.url);
            let contentType = 'text/plain';
            if (ext === '.html') contentType = 'text/html';
            if (ext === '.css') contentType = 'text/css';
            if (ext === '.js') contentType = 'application/javascript';
            if (ext === '.jpg' || ext === '.jpeg') contentType = 'image/jpeg';
            if (ext === '.png') contentType = 'image/png';
            if (ext === '.gif') contentType = 'image/gif';
            if (ext === '.svg') contentType = 'image/svg+xml';

            res.writeHead(200, { 'Content-Type': contentType });
            res.end(data);
        }
    });
    return;
}

    // Handle Add to Cart functionality
    if (req.url === '/add-to-cart' && req.method === 'POST') {
        handleAddToCart(req, res, db); // Pass the db connection to handleAddToCart
        return;
    }

    if (req.method === 'POST' && req.url === '/api/order') {
        let body = '';
        req.on('data', chunk => {
            body += chunk;
        });
        req.on('end', () => {
            const { product_id, quantity, username, product_name, product_price } = JSON.parse(body);

            if (!username) {
                res.writeHead(400, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ success: false, message: 'Username is required' }));
                return;
            }

            // Example: Insert order into the database (pseudo-code)
            const query = `INSERT INTO orders (username, product_id, product_name, product_price, quantity) 
                           VALUES ('${username}', ${product_id}, '${product_name}', ${product_price}, ${quantity})`;

            database.query(query, (err) => {
                if (err) {
                    console.error('Database error:', err);
                    res.writeHead(500, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ success: false, message: 'Failed to place order' }));
                } else {
                    res.writeHead(200, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ success: true, message: 'Order placed successfully' }));
                }
            });
        });
    }
    

    // Handle 404 Not Found
    res.writeHead(404, { 'Content-Type': 'text/plain' });
    res.end('404 Not Found');
});
const PORT = 3001;
server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
