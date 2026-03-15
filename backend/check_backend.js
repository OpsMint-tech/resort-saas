const fs = require('fs');
const http = require('http');

console.log('Monitoring localhost:5001...');
const req = http.request('http://localhost:5001/api/resorts', { method: 'GET' }, (res) => {
    console.log(`Backend status: ${res.statusCode}`);
});
req.on('error', (e) => {
    console.log(`Backend is NOT responding on 5001: ${e.message}`);
});
req.end();
