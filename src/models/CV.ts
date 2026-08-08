import mongoose from 'mongoose';
import { DEFAULT_TEMPLATE, TEMPLATE_IDS } from '@/data/templates';
import { locales } from '@/i18n/settings';

const cvSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
      index: true,
    },
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
    },
    personalInfo: {
      name: String,
      email: String,
      phone: String,
      location: String,
      website: String,
      linkedin: String,
      profilePhoto: String, // Base64 data URL or remote URL
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
    /** 0 means "not reviewed yet"; otherwise the last AI-reported ATS score. */
    atsScore: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },
    aiSuggestions: [String],
    atsReviewedAt: Date,
    templateId: {
      type: String,
      enum: TEMPLATE_IDS,
      default: DEFAULT_TEMPLATE,
    },
    /** Language the CV content is written in, used for rendered section labels. */
    language: {
      type: String,
      enum: locales,
      default: 'en',
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

cvSchema.index({ userId: 1, createdAt: -1 });

const CV = mongoose.models.CV || mongoose.model('CV', cvSchema);

export default CV;
