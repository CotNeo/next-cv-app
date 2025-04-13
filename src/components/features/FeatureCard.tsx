import { ReactNode } from 'react';
import { useTranslation } from '@/hooks/useTranslation';

interface FeatureCardProps {
  featureKey: string;
  icon: ReactNode;
}

export default function FeatureCard({ featureKey, icon }: FeatureCardProps) {
  const { t } = useTranslation();

  return (
    <div className="bg-gray-50 p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow">
      <div className="text-indigo-600 mb-4">{icon}</div>
      <h3 className="text-lg font-medium text-gray-900 mb-2">
        {t(`home.features.${featureKey}.title`)}
      </h3>
      <p className="text-gray-600">
        {t(`home.features.${featureKey}.description`)}
      </p>
    </div>
  );
} 