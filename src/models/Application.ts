import mongoose from 'mongoose';

const applicationSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    cvId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'CV',
    },
    jobTitle: { type: String, required: true },
    companyName: { type: String, required: true },
    jobDescription: { type: String, default: '' },
    coverLetter: { type: String, required: true },
    language: { type: String, default: 'tr' },
  },
  { timestamps: true }
);

applicationSchema.index({ userId: 1 });
applicationSchema.index({ cvId: 1 });

const Application =
  mongoose.models.Application || mongoose.model('Application', applicationSchema);

export default Application;
