const http = require('http');

const data = JSON.stringify({
    name: "Test Resort",
    images: ["data:image/png;base64," + "A".repeat(1024 * 1024 * 5)], // 5MB image
    description: "test",
    location: "test",
    pricePerNight: 100,
    category: "Beach"
});

const options = {
    hostname: 'localhost',
    port: 5001,
    path: '/api/resorts',
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
        'Content-Length': data.length,
        'Authorization': 'Bearer ' + process.argv[2] // Pass a token as arg
    }
};

console.log(`Sending ${data.length} bytes to backend...`);
const req = http.request(options, (res) => {
    console.log(`Status: ${res.statusCode}`);
    let body = '';
    res.on('data', (chunk) => body += chunk);
    res.on('end', () => console.log('Response:', body));
});

req.on('error', (e) => console.error(e));
req.write(data);
req.end();
