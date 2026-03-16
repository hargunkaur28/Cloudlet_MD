const fs = require('fs');
const path = require('path');
const axios = require('axios');
const FormData = require('form-data');

// Create dummy file
const dummyPath = path.join(__dirname, 'dummy.txt');
fs.writeFileSync(dummyPath, 'This is a test file for Mini Drive Cloudinary integration.');

const uploadTest = async () => {
  try {
    console.log('Logging in as admin to auto-seed...');
    const loginRes = await axios.post('http://localhost:5000/api/auth/login', {
      email: 'admin@minidrive.com',
      password: 'admin'
    });
    
    const cookie = loginRes.headers['set-cookie'] ? loginRes.headers['set-cookie'][0] : null;
    if (!cookie) throw new Error("No cookie received");

    // Upload file
    console.log('Uploading file...');
    const form = new FormData();
    form.append('file', fs.createReadStream(dummyPath));

    const uploadRes = await axios.post('http://localhost:5000/api/files/upload', form, {
      headers: {
        ...form.getHeaders(),
        Cookie: cookie
      }
    });

    console.log('Upload Success:', uploadRes.data.file.filename, '| URL:', uploadRes.data.file.url);
    fs.unlinkSync(dummyPath);
    console.log('Test complete and cleaned up.');
  } catch (err) {
    console.error('Upload Test Error:', err.response?.data || err.message);
  }
};

uploadTest();
