const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');

dotenv.config();

const checkUser = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        const id = '69b82626d93bbffb3b8eb8df';
        const user = await User.findById(id);
        if (user) {
            console.log('User found:', user.email);
        } else {
            console.log('User NOT found with ID:', id);
            // Search by email just in case
            const userByEmail = await User.findOne({ email: 'hikaru@example.com' });
            if (userByEmail) {
                console.log('User found by email, but ID is:', userByEmail._id);
            }
        }
        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

checkUser();
