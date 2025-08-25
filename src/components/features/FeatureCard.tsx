import { ReactNode } from 'react';
import { useTranslation } from '@/hooks/useTranslation';

interface FeatureCardProps {
  featureKey: string;
  icon: ReactNode;
}

export default function FeatureCard({ featureKey, icon }: FeatureCardProps) {
  const { t } = useTranslation();

  return (
    <div className="group relative bg-white p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-100">
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-50 to-purple-50 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      <div className="relative z-10">
        <div className="w-16 h-16 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
          <div className="text-white">
            {icon}
          </div>
        </div>
        <h3 className="text-xl font-bold text-gray-900 mb-4 group-hover:text-indigo-600 transition-colors duration-300">
          {t(`home.features.${featureKey}.title`)}
        </h3>
        <p className="text-gray-600 leading-relaxed">
          {t(`home.features.${featureKey}.description`)}
        </p>
      </div>
    </div>
  );
} 