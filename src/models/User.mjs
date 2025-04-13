import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  emailVerified: {
    type: Boolean,
    default: false,
  },
  subscriptionType: {
    type: String,
    enum: ['free', 'pay-as-you-go', 'monthly'],
    default: 'free',
  },
  subscriptionStatus: {
    type: String,
    enum: ['active', 'inactive', 'cancelled'],
    default: 'active',
  },
  subscriptionEndDate: {
    type: Date,
  },
  cvLimit: {
    type: Number,
    default: 1,
  },
  usedCvCount: {
    type: Number,
    default: 0,
  },
  credits: {
    type: Number,
    default: 0,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

// If mongoose.models.User exists, use it; otherwise, create a new model
const User = mongoose.models.User || mongoose.model('User', userSchema);

export default User; 