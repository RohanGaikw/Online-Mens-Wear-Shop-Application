const fs = require('fs');
const path = require('path');

const serveStaticFiles = (req, res) => {
    const filePath = path.join(__dirname, '../', req.url);
    const normalizedPath = path.normalize(filePath); // Normalize the path

    // Prevent directory traversal attacks
    if (!normalizedPath.startsWith(path.join(__dirname, '../'))) {
        res.writeHead(403, { 'Content-Type': 'text/plain' });
        res.end('403 Forbidden');
        return;
    }
    
    console.log('Requesting file:', normalizedPath);
    fs.readFile(normalizedPath, (err, data) => {
        if (err) {
            res.writeHead(404, { 'Content-Type': 'text/plain' });
            res.end('404 Not Found');
        } else {
            const ext = path.extname(req.url);
            let contentType = 'application/octet-stream'; // Default for unknown types

            switch (ext) {
                case '.html':
                    contentType = 'text/html';
                    break;
                case '.css':
                    contentType = 'text/css';
                    break;
                case '.js':
                    contentType = 'application/javascript';
                    break;
                case '.jpg':
                case '.jpeg':
                    contentType = 'image/jpeg';
                    break;
                case '.png':
                    contentType = 'image/png';
                    break;
                case '.gif':
                    contentType = 'image/gif';
                    break;
            }

            res.writeHead(200, { 'Content-Type': contentType, 'Cache-Control': 'public, max-age=31536000' }); // Cache for 1 year
            res.end(data);
        }
    });
};

const handleAddToCart = (req, res, db) => {
    let body = '';
    req.on('data', (chunk) => {
        body += chunk.toString();
    });

    req.on('end', () => {
        let data;

        try {
            data = JSON.parse(body); // Parse JSON data
        } catch (err) {
            res.writeHead(400, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ success: false, message: 'Invalid JSON' }));
            return;
        }

        const { product_id: productId, quantity, user_id: userId, product_name: productName, product_price: productPrice } = data; // Destructure values

        // Validate required fields
        if (!userId || !productId || !quantity || !productName || !productPrice) {
            res.writeHead(400, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ success: false, message: 'User ID, Product ID, Quantity, Product Name, and Product Price are required' }));
            return;
        }

        // Logic to add/update product in the cart in the database
        const query = `
            INSERT INTO cart (user_id, product_id, product_name, product_price, quantity)
            VALUES (?, ?, ?, ?, ?)
            ON DUPLICATE KEY UPDATE quantity = quantity + ?`;

        db.query(query, [userId, productId, productName, parseFloat(productPrice), quantity, quantity], (err) => {
            if (err) {
                console.error('Database Error:', err);
                res.writeHead(500, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ success: false, message: 'Internal Server Error' }));
                return;
            }
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ success: true, message: 'Item added to cart' }));
        });
    });
};

module.exports = { serveStaticFiles, handleAddToCart };


// const handleAddToCart = (req, res, db) => {
//     let body = '';
//     req.on('data', (chunk) => {
//         body += chunk.toString();
//     });

//     req.on('end', () => {
//         let data;

//         try {
//             data = JSON.parse(body); // Parse JSON data
//         } catch (err) {
//             res.writeHead(400, { 'Content-Type': 'application/json' });
//             res.end(JSON.stringify({ success: false, message: 'Invalid JSON' }));
//             return;
//         }

//         const { product_id: productId, quantity, user_id: userId} = data; // Destructure values

//         // Validate required fields
//         if (!userId || !productId || !quantity ) {
//             res.writeHead(400, { 'Content-Type': 'application/json' });
//             res.end(JSON.stringify({ success: false, message: 'User ID, Product ID, and Quantity are required' }));
//             return;
//         }

//         // Logic to add/update product in the cart in the database
//         const query = `
//             INSERT INTO cart (user_id, product_id, quantity)
//             VALUES (?, ?, ?)
//             ON DUPLICATE KEY UPDATE quantity = quantity + ?`;

//         db.query(query, [userId, productId, quantity, quantity], (err) => {
//             if (err) {
//                 console.error('Database Error:', err);
//                 res.writeHead(500, { 'Content-Type': 'application/json' });
//                 res.end(JSON.stringify({ success: false, message: 'Internal Server Error' }));
//                 return;
//             }
//             res.writeHead(200, { 'Content-Type': 'application/json' });
//             res.end(JSON.stringify({ success: true, message: 'Item added to cart' }));
//         });
//     });
// };

// module.exports = { serveStaticFiles, handleAddToCart };
