import mongoose from 'mongoose';
import { locales } from '@/i18n/settings';

const applicationSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
      index: true,
    },
    cvId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'CV',
      index: true,
    },
    jobTitle: { type: String, required: true, trim: true },
    companyName: { type: String, required: true, trim: true },
    jobDescription: { type: String, default: '' },
    coverLetter: { type: String, required: true },
    language: { type: String, enum: locales, default: 'tr' },
  },
  { timestamps: true }
);

applicationSchema.index({ userId: 1, createdAt: -1 });

const Application =
  mongoose.models.Application || mongoose.model('Application', applicationSchema);

export default Application;
