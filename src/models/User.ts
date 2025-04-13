import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'İsim gerekli'],
    },
    email: {
      type: String,
      required: [true, 'Email gerekli'],
      unique: true,
    },
    password: {
      type: String,
      required: [true, 'Şifre gerekli'],
    },
    cvLimit: {
      type: Number,
      default: 1, // First CV is free
    },
    paymentHistory: [{
      amount: Number,
      date: Date,
      cvId: mongoose.Schema.Types.ObjectId,
    }],
  },
  {
    timestamps: true,
  }
);

// Create indexes
userSchema.index({ email: 1 }, { unique: true });

const User = mongoose.models.User || mongoose.model('User', userSchema);

export default User; 