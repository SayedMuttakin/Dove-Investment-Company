import axios from 'axios';
import fs from 'fs';

const testApiRegister = async () => {
    const baseUrl = 'http://localhost:5000/api';
    const email = `api_test_${Date.now()}@test.com`;

    try {
        console.log(`Testing registration for: ${email}`);
        const response = await axios.post(`${baseUrl}/auth/register`, {
            fullName: 'API Test User',
            phone: email,
            password: 'password123',
            invitationCode: '' // Optional
        });

        const resData = {
            status: response.status,
            data: response.data
        };
        console.log('Success:', JSON.stringify(resData, null, 2));
        fs.writeFileSync('server/api_test_success.json', JSON.stringify(resData, null, 2));

    } catch (error) {
        const errData = {
            status: error.response?.status,
            data: error.response?.data,
            message: error.message
        };
        console.error('API Test Failed:', JSON.stringify(errData, null, 2));
        fs.writeFileSync('server/api_test_error.json', JSON.stringify(errData, null, 2));
    }
};

testApiRegister();
