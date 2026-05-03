import http from 'http';

const registerAdmin = async () => {
  const data = JSON.stringify({
    username: 'admin',
    email: 'admin@example.com',
    password: 'admin123',
    role: 'admin'
  });

  const options = {
    hostname: 'localhost',
    port: 5000,
    path: '/auth/register',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': data.length
    }
  };

  const req = http.request(options, (res) => {
    let body = '';
    res.on('data', (chunk) => {
      body += chunk;
    });
    res.on('end', () => {
      try {
        const response = JSON.parse(body);
        if (res.statusCode === 201) {
          console.log('✅ Admin user created successfully!');
          console.log('Username: admin');
          console.log('Password: admin123');
          console.log('Email: admin@example.com');
          console.log('\nYou can now login at http://localhost:5173/login');
        } else if (res.statusCode === 400) {
          console.log('✅ Admin user already exists!');
          console.log('Username: admin');
          console.log('Password: admin123');
          console.log('\nYou can login at http://localhost:5173/login');
        }
      } catch (e) {
        console.error('Error parsing response:', e.message);
      }
    });
  });

  req.on('error', (error) => {
    console.error('❌ Error:', error.message);
    console.error('Make sure the backend server is running on port 5000');
  });

  req.write(data);
  req.end();
};

registerAdmin();
