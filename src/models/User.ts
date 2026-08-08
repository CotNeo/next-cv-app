import mongoose from 'mongoose';

export interface UserDocument extends mongoose.Document {
  _id: mongoose.Types.ObjectId;
  name: string;
  email: string;
  /** Absent for accounts created through an OAuth provider. */
  password?: string;
  image?: string;
  authProviders: string[];
  cvLimit: number;
  paymentHistory: {
    amount: number;
    date: Date;
    cvId?: mongoose.Types.ObjectId;
  }[];
  createdAt: Date;
  updatedAt: Date;
}

const userSchema = new mongoose.Schema<UserDocument>(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    // Optional: OAuth accounts authenticate through their provider instead.
    password: {
      type: String,
      select: false,
    },
    image: String,
    /** Which providers this account can sign in with, e.g. ['credentials', 'google']. */
    authProviders: {
      type: [String],
      default: ['credentials'],
    },
    cvLimit: {
      type: Number,
      default: 1, // Overridden by FREE_CV_LIMIT for new signups.
      min: 0,
    },
    paymentHistory: [
      {
        amount: Number,
        date: Date,
        cvId: mongoose.Schema.Types.ObjectId,
      },
    ],
  },
  {
    timestamps: true,
  }
);

const User =
  (mongoose.models.User as mongoose.Model<UserDocument>) ||
  mongoose.model<UserDocument>('User', userSchema);

export default User;
