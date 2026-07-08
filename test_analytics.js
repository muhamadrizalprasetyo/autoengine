const axios = require('axios');

async function testAnalytics() {
  try {
    // Login first
    const loginResponse = await axios.post('http://localhost:5000/api/auth/login', {
      email: 'admin@autoengine.com',
      password: 'admin123'
    });
    
    console.log('Login successful');
    console.log('Token:', loginResponse.data.token);
    console.log('User:', loginResponse.data.user);
    
    // Get analytics with token
    const analyticsResponse = await axios.get('http://localhost:5000/api/transactions/analytics/data', {
      headers: {
        Authorization: `Bearer ${loginResponse.data.token}`
      }
    });
    
    console.log('\nAnalytics data:');
    console.log(JSON.stringify(analyticsResponse.data, null, 2));
    
  } catch (error) {
    console.error('Error:', error.response?.data || error.message);
  }
}

testAnalytics();
