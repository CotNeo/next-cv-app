import { useTranslation } from '@/hooks/useTranslation';

interface HowItWorksStepProps {
  step: number;
}

export default function HowItWorksStep({ step }: HowItWorksStepProps) {
  const { t } = useTranslation();

  return (
    <div className="group relative bg-white p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
      <div className="flex flex-col items-center text-center">
        <div className="relative mb-6">
          <div className="w-16 h-16 bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-full flex items-center justify-center text-xl font-bold group-hover:scale-110 transition-transform duration-300 shadow-lg">
            {step}
          </div>
          {step < 4 && (
            <div className="hidden lg:block absolute top-1/2 left-full w-16 h-0.5 bg-gradient-to-r from-indigo-500 to-purple-500 transform -translate-y-1/2"></div>
          )}
        </div>
        <h3 className="text-xl font-bold text-gray-900 mb-4 group-hover:text-indigo-600 transition-colors duration-300">
          {t(`home.howItWorks.steps.${step}.title`)}
        </h3>
        <p className="text-gray-600 leading-relaxed">
          {t(`home.howItWorks.steps.${step}.description`)}
        </p>
      </div>
    </div>
  );
} 