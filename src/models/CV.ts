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
      profilePhoto: String, // Base64 or URL
    },
    summary: String,
    workExperience: [
      {
        company: String,
        position: String,
        startDate: Date,
        endDate: Date,
        description: String,
        isCurrent: Boolean,
      },
    ],
    education: [
      {
        institution: String,
        degree: String,
        field: String,
        startDate: Date,
        endDate: Date,
        isCurrent: Boolean,
      },
    ],
    skills: [String],
    languages: [
      {
        language: String,
        level: String,
      },
    ],
    certifications: [
      {
        name: String,
        issuer: String,
        date: Date,
        expiryDate: Date,
        credentialId: String,
        credentialUrl: String,
      },
    ],
    projects: [
      {
        name: String,
        description: String,
        technologies: [String],
        url: String,
        startDate: Date,
        endDate: Date,
        isCurrent: Boolean,
      },
    ],
    references: [
      {
        name: String,
        position: String,
        company: String,
        email: String,
        phone: String,
      },
    ],
    atsScore: {
      type: Number,
      default: 0,
    },
    aiSuggestions: [String],
    templateId: {
      type: String,
      default: 'modern',
    },
    shareToken: {
      type: String,
      unique: true,
      sparse: true,
    },
    isPublic: {
      type: Boolean,
      default: false,
    },
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