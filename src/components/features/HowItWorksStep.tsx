import { useTranslation } from '@/hooks/useTranslation';

interface HowItWorksStepProps {
  step: number;
}

export default function HowItWorksStep({ step }: HowItWorksStepProps) {
  const { t } = useTranslation();

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm">
      <div className="w-12 h-12 bg-indigo-600 text-white rounded-full flex items-center justify-center text-xl font-bold mb-4">
        {step}
      </div>
      <h3 className="text-lg font-medium text-gray-900 mb-2">
        {t(`home.howItWorks.steps.${step}.title`)}
      </h3>
      <p className="text-gray-600">
        {t(`home.howItWorks.steps.${step}.description`)}
      </p>
    </div>
  );
} 