const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');

dotenv.config();

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['user', 'admin'], default: 'user' },
}, { timestamps: true });

const User = mongoose.model('User', userSchema);

async function fixAdmin() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    // Check if admin exists
    let admin = await User.findOne({ email: 'admin@minidrive.com' });
    
    if (admin) {
      console.log('Admin user found. Updating password to admin123...');
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash('admin123', salt);
      
      admin.password = hashedPassword;
      admin.role = 'admin';
      await admin.save();
      
      console.log('Admin password updated successfully!');
    } else {
      console.log('Admin user not found. Creating new admin...');
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash('admin123', salt);
      
      admin = await User.create({
        name: 'Admin',
        email: 'admin@minidrive.com',
        password: hashedPassword,
        role: 'admin'
      });
      
      console.log('Admin user created successfully!');
    }

    console.log('\nAdmin credentials:');
    console.log('Email: admin@minidrive.com');
    console.log('Password: admin123');
    
    await mongoose.connection.close();
    console.log('\nDatabase connection closed.');
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

fixAdmin();
