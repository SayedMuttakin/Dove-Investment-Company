import axios from 'axios';

const testRegistration = async () => {
    try {
        const phone = `testuser_${Date.now()}`;
        const password = 'password123';
        const fullName = 'Test User';

        console.log(`Attempting registration for: ${phone}`);

        const response = await axios.post('http://localhost:5000/api/auth/register', {
            phone,
            password,
            fullName
        });

        console.log('Registration Response Status:', response.status);
        console.log('User Data in Response:', response.data.user);

        if (response.data.user.balance === 8) {
            console.log('✅ Success: Registration bonus is $8');
        } else {
            console.log(`❌ Failure: Registration bonus is $${response.data.user.balance}`);
        }
    } catch (error) {
        console.error('Registration failed:', error.response ? error.response.data : error.message);
    }
};

testRegistration();
