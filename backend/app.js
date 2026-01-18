const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
.then(async () => {
  console.log('MongoDB connected');
  // Initialize default users
  const User = require('./models/User');
  const bcrypt = require('bcryptjs');

  const defaultUsers = [
    { name: 'Doctor John', email: 'doctor@clinic.com', password: 'password123', role: 'doctor' },
    { name: 'Receptionist Jane', email: 'receptionist@clinic.com', password: 'password123', role: 'receptionist' }
  ];

  for (const userData of defaultUsers) {
    const existingUser = await User.findOne({ email: userData.email });
    if (!existingUser) {
      const hashedPassword = await bcrypt.hash(userData.password, 10);
      const user = new User({ ...userData, password: hashedPassword });
      await user.save();
      console.log(`Created default user: ${userData.email}`);
    }
  }
})
.catch(err => console.error('MongoDB connection error:', err));

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/patients', require('./routes/patients'));
app.use('/api/tokens', require('./routes/tokens'));
app.use('/api/prescriptions', require('./routes/prescriptions'));
app.use('/api/bills', require('./routes/bills'));
app.use('/api/tests', require('./routes/tests'));

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
