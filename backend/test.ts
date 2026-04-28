import http from 'http';

const testBackend = () => {
  console.log('Testing GET /api/events...');
  
  http.get('http://localhost:5000/api/events', (res) => {
    let data = '';

    res.on('data', (chunk) => {
      data += chunk;
    });

    res.on('end', () => {
      if (res.statusCode === 200) {
        console.log('✅ GET /api/events passed. Response:', data);
        console.log('Backend test completed successfully without runtime errors!');
      } else {
        console.error('❌ GET /api/events failed with status:', res.statusCode, data);
      }
    });

  }).on('error', (err) => {
    console.error('❌ Request failed:', err.message);
  });
};

setTimeout(testBackend, 3000); // Give backend 3 seconds to fully boot Up
