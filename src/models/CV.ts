import mongoose from 'mongoose';

const cvSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    title: {
      type: String,
      required: [true, 'CV başlığı gerekli'],
    },
    personalInfo: {
      name: String,
      email: String,
      phone: String,
      location: String,
      website: String,
      linkedin: String,
    },
    summary: String,
    workExperience: [
      {
        company: String,
        position: String,
        startDate: Date,
        endDate: Date,
        description: String,
      },
    ],
    education: [
      {
        institution: String,
        degree: String,
        field: String,
        startDate: Date,
        endDate: Date,
      },
    ],
    skills: [String],
    languages: [
      {
        language: String,
        level: String,
      },
    ],
    atsScore: {
      type: Number,
      default: 0,
    },
    aiSuggestions: [String],
  },
  {
    timestamps: true,
  }
);

// Create indexes
cvSchema.index({ userId: 1 });
cvSchema.index({ createdAt: -1 });

const CV = mongoose.models.CV || mongoose.model('CV', cvSchema);

export default CV; 