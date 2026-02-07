import { useTranslation } from '@/hooks/useTranslation';
import { defaultLocale, type ValidLocale } from '@/i18n/settings';

interface FeatureCardProps {
  featureKey: string;
  icon: string;
  locale?: ValidLocale;
}

export default function FeatureCard({ featureKey, icon, locale = defaultLocale }: FeatureCardProps) {
  const { t } = useTranslation(locale);

  return (
    <div className="bg-white border border-stone-200 rounded-lg p-6 hover:border-stone-300 transition-colors">
      <div className="w-10 h-10 rounded bg-stone-100 text-stone-600 flex items-center justify-center text-lg font-medium mb-4">
        {icon}
      </div>
      <h3 className="text-lg font-semibold text-stone-900 mb-2">
        {t(`home.features.${featureKey}.title`)}
      </h3>
      <p className="text-sm text-stone-600 leading-relaxed">
        {t(`home.features.${featureKey}.description`)}
      </p>
    </div>
  );
}
